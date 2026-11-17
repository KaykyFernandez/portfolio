import * as THREE from 'three'
import { skillGroups } from '../data/portfolio'
import { disposeTree, mountStage, type Palette, type StageContext } from './stage'

// Habilidades: as tecnologias distribuídas numa esfera e ligadas como uma rede.
// Arrastar gira o globo (com inércia); passar o mouse destaca a tecnologia;
// "pacotes" de luz percorrem algumas ligações.

const RADIUS = 4.3
const FONT_PX = 60
const LABEL_HEIGHT = 0.42

type Label = {
  sprite: THREE.Sprite
  canvas: HTMLCanvasElement
  texture: THREE.CanvasTexture
  text: string
  group: number
  baseScale: THREE.Vector2
  hover: number
}

function fibonacciSphere(n: number, r: number) {
  const pts: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts.push(new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r))
  }
  return pts
}

function groupColor(p: Palette, group: number) {
  const list = [p.css.accentFg, p.css.accent2, p.css.fg]
  return list[group % list.length]
}

function drawLabel(label: Label, color: string) {
  const { canvas } = label
  const g = canvas.getContext('2d')!
  const font = `600 ${FONT_PX}px "Inter Variable", system-ui, sans-serif`
  g.font = font
  const pad = FONT_PX * 0.3
  const w = Math.ceil(g.measureText(label.text).width + pad * 2)
  const h = Math.ceil(FONT_PX * 1.35)
  canvas.width = w
  canvas.height = h
  g.font = font
  g.textBaseline = 'middle'
  g.fillStyle = color
  g.fillText(label.text, pad, h / 2 + FONT_PX * 0.04)
  label.baseScale.set((w / h) * LABEL_HEIGHT, LABEL_HEIGHT)
  label.sprite.scale.set(label.baseScale.x, label.baseScale.y, 1)
  // O tamanho do canvas pode mudar: recria a textura no próximo upload.
  label.texture.dispose()
  label.texture.needsUpdate = true
}

function createGlobe(ctx: StageContext) {
  const { renderer, canvas, invalidate, reducedMotion } = ctx
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60)
  camera.position.set(0, 0, 14)

  const globe = new THREE.Group()
  globe.rotation.set(0.35, -0.6, 0)
  scene.add(globe)

  const items = skillGroups.flatMap((g, group) => g.items.map((text) => ({ text, group })))
  const points = fibonacciSphere(items.length, RADIUS)

  // ---- Rótulos (sprites com textura de canvas) ----
  const labels: Label[] = items.map(({ text, group }, i) => {
    const c = document.createElement('canvas')
    const texture = new THREE.CanvasTexture(c)
    texture.anisotropy = 4
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, depthTest: false }),
    )
    sprite.center.set(0.5, -0.25) // o texto fica logo acima do nó
    sprite.position.copy(points[i])
    globe.add(sprite)
    const label: Label = { sprite, canvas: c, texture, text, group, baseScale: new THREE.Vector2(1, 1), hover: 0 }
    return label
  })

  // ---- Nós ----
  const nodeGeo = new THREE.BufferGeometry().setFromPoints(points)
  const nodeMat = new THREE.PointsMaterial({ size: 0.13, sizeAttenuation: true, transparent: true, depthWrite: false })
  globe.add(new THREE.Points(nodeGeo, nodeMat))

  // ---- Ligações: cada nó com os 3 vizinhos mais próximos ----
  const edges: [number, number][] = []
  const seen = new Set<string>()
  points.forEach((a, i) => {
    points
      .map((b, j) => ({ j, d: a.distanceToSquared(b) }))
      .filter((o) => o.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([i, j])
        }
      })
  })
  const edgePos = new Float32Array(edges.length * 6)
  edges.forEach(([i, j], k) => {
    points[i].toArray(edgePos, k * 6)
    points[j].toArray(edgePos, k * 6 + 3)
  })
  const edgeGeo = new THREE.BufferGeometry()
  edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3))
  const edgeMat = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false })
  globe.add(new THREE.LineSegments(edgeGeo, edgeMat))

  // ---- Casca interna ----
  const shellGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(RADIUS * 0.62, 1))
  const shellMat = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false })
  const shell = new THREE.LineSegments(shellGeo, shellMat)
  globe.add(shell)

  // ---- Pacotes percorrendo as ligações ----
  const packetCount = Math.min(16, edges.length)
  const packets = Array.from({ length: packetCount }, () => ({
    edge: Math.floor(Math.random() * edges.length),
    t: Math.random(),
    speed: 0.35 + Math.random() * 0.5,
  }))
  const packetPos = new Float32Array(packetCount * 3)
  const packetGeo = new THREE.BufferGeometry()
  packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPos, 3))
  const packetMat = new THREE.PointsMaterial({ size: 0.2, sizeAttenuation: true, transparent: true, depthWrite: false })
  const packetPoints = new THREE.Points(packetGeo, packetMat)
  packetPoints.frustumCulled = false
  globe.add(packetPoints)

  // A névoa esmaece a metade de trás do globo (cor = fundo da página).
  scene.fog = new THREE.Fog(0x000000, 11, 19)

  const setPalette = (p: Palette) => {
    for (const l of labels) drawLabel(l, groupColor(p, l.group))
    ;(scene.fog as THREE.Fog).color.copy(p.bg)
    nodeMat.color.copy(p.accent2)
    edgeMat.color.copy(p.accentFg)
    edgeMat.opacity = p.isLight ? 0.45 : 0.32
    shellMat.color.copy(p.accent)
    shellMat.opacity = p.isLight ? 0.18 : 0.22
    packetMat.color.copy(p.accent2)
    const blending = p.isLight ? THREE.NormalBlending : THREE.AdditiveBlending
    packetMat.blending = blending
    packetMat.needsUpdate = true
  }
  setPalette(ctx.palette)

  // A fonte do site pode terminar de carregar depois: redesenha os rótulos.
  let alive = true
  document.fonts?.load(`600 ${FONT_PX}px "Inter Variable"`).then(() => {
    if (!alive) return
    setPalette(ctx.palette)
    invalidate()
  })

  // ---- Interação ----
  const velocity = new THREE.Vector2(0, reducedMotion ? 0 : 0.12) // x: inclinação, y: giro
  const autoSpin = reducedMotion ? 0 : 0.12
  let dragging = false
  let lastX = 0
  let lastY = 0
  const hoverPointer = new THREE.Vector2(9, 9)
  const raycaster = new THREE.Raycaster()
  raycaster.camera = camera
  let hovered: Label | null = null

  const onDown = (e: PointerEvent) => {
    dragging = true
    lastX = e.clientX
    lastY = e.clientY
    canvas.setPointerCapture(e.pointerId)
    canvas.style.cursor = 'grabbing'
  }
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    hoverPointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    if (dragging) {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      globe.rotation.y += dx * 0.006
      globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + dy * 0.006, -1.1, 1.1)
      velocity.set(dy * 0.25, dx * 0.25)
    }
    invalidate()
  }
  const onUp = (e: PointerEvent) => {
    dragging = false
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    canvas.style.cursor = ''
  }
  const onLeave = () => {
    hoverPointer.set(9, 9)
    invalidate()
  }
  canvas.style.touchAction = 'pan-y' // no celular, rolar a página na vertical continua funcionando
  canvas.style.cursor = 'grab'
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  canvas.addEventListener('pointerleave', onLeave)

  const worldPos = new THREE.Vector3()

  return {
    resize(w: number, h: number) {
      camera.aspect = w / h
      // Afasta a câmera quando o espaço é estreito, para o globo caber inteiro.
      const fitH = (RADIUS + 1.1) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      camera.position.z = Math.max(fitH, fitH / camera.aspect)
      const near = camera.position.z - RADIUS * 0.4
      ;(scene.fog as THREE.Fog).near = near
      ;(scene.fog as THREE.Fog).far = near + RADIUS * 2.2
      camera.updateProjectionMatrix()
    },
    frame(time: number, delta: number) {
      if (!dragging && delta > 0) {
        // Inércia que volta ao giro automático.
        const k = Math.pow(0.04, delta)
        velocity.x *= k
        velocity.y = autoSpin + (velocity.y - autoSpin) * k
        globe.rotation.y += velocity.y * delta
        globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + velocity.x * delta, -1.1, 1.1)
        globe.rotation.x += (0.35 - globe.rotation.x) * (1 - Math.pow(0.5, delta)) * 0.3
      }
      shell.rotation.y = -time * 0.15
      shell.rotation.z = time * 0.08

      // Hover
      let next: Label | null = null
      if (Math.abs(hoverPointer.x) <= 1 && Math.abs(hoverPointer.y) <= 1) {
        raycaster.setFromCamera(hoverPointer, camera)
        const hits = raycaster.intersectObjects(
          labels.map((l) => l.sprite),
          false,
        )
        // Só conta rótulos da frente do globo.
        const front = hits.find((h) => h.object.getWorldPosition(worldPos).z > -0.5)
        next = front ? (labels.find((l) => l.sprite === front.object) ?? null) : null
      }
      if (next !== hovered) {
        hovered = next
        canvas.style.cursor = dragging ? 'grabbing' : hovered ? 'pointer' : 'grab'
      }

      // Profundidade: rótulos de trás ficam menores e mais apagados.
      let animating = false
      for (const l of labels) {
        l.sprite.getWorldPosition(worldPos)
        const front = THREE.MathUtils.clamp((worldPos.z + RADIUS) / (2 * RADIUS), 0, 1)
        const target = l === hovered ? 1 : 0
        const step = delta > 0 ? 1 - Math.pow(0.0005, delta) : 1
        l.hover += (target - l.hover) * step
        if (Math.abs(target - l.hover) > 0.01) animating = true
        const s = 0.75 + front * 0.35 + l.hover * 0.45
        l.sprite.scale.set(l.baseScale.x * s, l.baseScale.y * s, 1)
        const mat = l.sprite.material
        mat.opacity = 0.08 + Math.pow(front, 2.2) * 0.92
        if (hovered && l !== hovered) mat.opacity *= 0.55
        l.sprite.renderOrder = Math.round(front * 100) + (l === hovered ? 200 : 0)
      }
      if (animating && reducedMotion) invalidate()

      // Pacotes
      if (!reducedMotion) {
        packets.forEach((pk, i) => {
          pk.t += delta * pk.speed
          if (pk.t >= 1) {
            pk.t = 0
            pk.edge = Math.floor(Math.random() * edges.length)
          }
          const [a, b] = edges[pk.edge]
          worldPos.lerpVectors(points[a], points[b], pk.t).toArray(packetPos, i * 3)
        })
        packetGeo.attributes.position.needsUpdate = true
      } else {
        packetPoints.visible = false
      }

      renderer.render(scene, camera)
    },
    setPalette,
    dispose() {
      alive = false
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
      disposeTree(scene)
    },
  }
}

export function mount(container: HTMLElement) {
  return mountStage(container, createGlobe, { interactive: true, maxDpr: 2 })
}
