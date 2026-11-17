import * as THREE from 'three'
import { disposeTree, mountStage, type Palette, type StageContext } from './stage'

// Hero: um "terreno" de partículas em onda, visto em perspectiva. O mouse cria uma
// ondulação no ponto do plano para onde aponta, e a câmera acompanha de leve (parallax).

const waveVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseAmt;
  uniform float uSize;
  uniform float uDpr;
  attribute float aRand;
  varying float vH;
  varying float vFade;

  void main() {
    vec3 p = position;
    float t = uTime;
    float h = sin(p.x * 0.21 + t * 0.55) * 0.9
            + cos(p.z * 0.27 - t * 0.42) * 0.7
            + sin((p.x + p.z) * 0.11 + t * 0.3) * 0.8;

    float d = distance(p.xz, uMouse);
    float bump = exp(-d * d * 0.03) * 1.7;
    float ring = sin(d * 1.05 - t * 3.2) * exp(-d * 0.22) * 0.4;
    float ripple = (bump + ring) * uMouseAmt;

    p.y += h * 0.65 + ripple;
    vH = clamp((h + 2.4) / 4.8 + ripple * 0.3, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = uSize * uDpr * (0.55 + aRand * 0.7) * (10.0 / depth);
    vFade = smoothstep(48.0, 16.0, depth) * smoothstep(0.8, 4.0, depth) * smoothstep(40.0, 24.0, abs(p.x));
  }
`

const waveFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uAlpha;
  varying float vH;
  varying float vFade;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.08, r);
    vec3 col = mix(uColorA, uColorB, smoothstep(0.35, 0.95, vH));
    gl_FragColor = vec4(col, a * vFade * uAlpha);
  }
`

// Poeira flutuando acima da onda, para dar profundidade.
const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uDpr;
  attribute float aRand;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * (0.15 + aRand * 0.25), 9.0) - 1.0;
    p.x += sin(uTime * 0.3 + aRand * 6.28) * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uDpr * (0.4 + aRand) * (10.0 / -mv.z);
    vAlpha = smoothstep(-1.0, 1.5, p.y) * smoothstep(8.0, 5.0, p.y) * (0.35 + aRand * 0.65);
  }
`

const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, r) * vAlpha * uAlpha);
  }
`

function createWave(ctx: StageContext) {
  const { renderer, pointer, reducedMotion } = ctx
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
  const lookTarget = new THREE.Vector3(0, -0.6, -8)
  const camBase = new THREE.Vector3(0, 3.1, 10)
  camera.position.copy(camBase)
  camera.lookAt(lookTarget)

  // ---- Onda ----
  const cols = 170
  const rows = 84
  const positions = new Float32Array(cols * rows * 3)
  const rand = new Float32Array(cols * rows)
  for (let j = 0, k = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++, k++) {
      positions[k * 3] = (i / (cols - 1) - 0.5) * 80
      positions[k * 3 + 1] = 0
      positions[k * 3 + 2] = 8 - (j / (rows - 1)) * 46
      rand[k] = Math.random()
    }
  }
  const waveGeo = new THREE.BufferGeometry()
  waveGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  waveGeo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))

  const dpr = renderer.getPixelRatio()
  const waveMat = new THREE.ShaderMaterial({
    vertexShader: waveVertex,
    fragmentShader: waveFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, -6) },
      uMouseAmt: { value: 0 },
      uSize: { value: 3.3 },
      uDpr: { value: dpr },
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uAlpha: { value: 1 },
    },
  })
  const wave = new THREE.Points(waveGeo, waveMat)
  wave.frustumCulled = false
  scene.add(wave)

  // ---- Poeira ----
  const dustCount = 280
  const dustPos = new Float32Array(dustCount * 3)
  const dustRand = new Float32Array(dustCount)
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 44
    dustPos[i * 3 + 1] = Math.random() * 9
    dustPos[i * 3 + 2] = 4 - Math.random() * 30
    dustRand[i] = Math.random()
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  dustGeo.setAttribute('aRand', new THREE.BufferAttribute(dustRand, 1))
  const dustMat = new THREE.ShaderMaterial({
    vertexShader: dustVertex,
    fragmentShader: dustFragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 3.2 },
      uDpr: { value: dpr },
      uColor: { value: new THREE.Color() },
      uAlpha: { value: 1 },
    },
  })
  const dust = new THREE.Points(dustGeo, dustMat)
  dust.frustumCulled = false
  scene.add(dust)

  const setPalette = (p: Palette) => {
    // No escuro as partículas somam luz; no claro, mistura normal com tons mais fortes.
    const blending = p.isLight ? THREE.NormalBlending : THREE.AdditiveBlending
    waveMat.blending = blending
    dustMat.blending = blending
    waveMat.uniforms.uColorA.value.copy(p.isLight ? p.accent : p.accentFg)
    waveMat.uniforms.uColorB.value.copy(p.accent2)
    waveMat.uniforms.uAlpha.value = p.isLight ? 0.7 : 0.95
    dustMat.uniforms.uColor.value.copy(p.isLight ? p.accent : p.accentFg)
    dustMat.uniforms.uAlpha.value = p.isLight ? 0.45 : 0.7
  }
  setPalette(ctx.palette)

  // ---- Ponteiro → ponto no plano ----
  const raycaster = new THREE.Raycaster()
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const hit = new THREE.Vector3()
  const mouseTarget = new THREE.Vector2(0, -6)
  const lastPointer = new THREE.Vector2(9, 9)
  let energy = 0

  return {
    resize(w: number, h: number) {
      camera.aspect = w / h
      // Em telas estreitas a câmera abre o campo de visão para a onda não ficar "cortada".
      camera.fov = w < 640 ? 70 : 55
      camera.updateProjectionMatrix()
    },
    frame(time: number, delta: number) {
      const inside = Math.abs(pointer.x) <= 1 && Math.abs(pointer.y) <= 1
      if (!pointer.equals(lastPointer)) {
        lastPointer.copy(pointer)
        if (inside) energy = 1
      }
      energy = Math.max(inside ? 0.45 : 0, energy - delta * 0.6)

      if (inside) {
        raycaster.setFromCamera(pointer, camera)
        if (raycaster.ray.intersectPlane(plane, hit)) mouseTarget.set(hit.x, hit.z)
      }
      const u = waveMat.uniforms
      const k = 1 - Math.pow(0.001, delta)
      u.uMouse.value.lerp(mouseTarget, k)
      u.uMouseAmt.value += (energy - u.uMouseAmt.value) * k

      // Sem movimento contínuo, um quadro fixo ainda bonito.
      const t = reducedMotion ? 4 : time
      u.uTime.value = t
      dustMat.uniforms.uTime.value = t

      const px = inside ? pointer.x : 0
      const py = inside ? pointer.y : 0
      camera.position.x += (camBase.x + px * 1.4 - camera.position.x) * k * 0.6
      camera.position.y += (camBase.y + py * 0.6 - camera.position.y) * k * 0.6
      camera.lookAt(lookTarget)

      renderer.render(scene, camera)
    },
    setPalette,
    dispose() {
      disposeTree(scene)
    },
  }
}

export function mount(container: HTMLElement) {
  return mountStage(container, createWave, { maxDpr: 1.5 })
}
