import * as THREE from 'three'
import { disposeTree, mountStage, type Palette, type StageContext } from './stage'

// Contato: um orbe "vivo" (esfera deformada por ruído 3D no shader), com brilho nas bordas,
// uma casca geométrica e um anel de partículas. Ele se vira para o mouse e fica mais
// agitado quando o mouse se move rápido.

// Ruído simplex 3D (Ashima Arts / Stefan Gustavson, licença MIT).
const noise = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`

const orbVertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  ${noise}

  float field(vec3 n) {
    return snoise(n * 1.15 + uTime * 0.28) * 0.75 + snoise(n * 2.6 - uTime * 0.2) * 0.25;
  }

  void main() {
    vec3 n = normalize(normal);
    float f = field(n);
    vec3 displaced = position + n * f * uAmp;

    // Normal aproximada por diferenças finitas, para o brilho seguir a deformação.
    vec3 t = normalize(cross(n, abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 b = normalize(cross(n, t));
    float e = 0.04;
    vec3 nt = normalize(n + t * e);
    vec3 nb = normalize(n + b * e);
    vec3 pt = nt * (length(position) + field(nt) * uAmp);
    vec3 pb = nb * (length(position) + field(nb) * uAmp);
    vec3 dn = normalize(cross(pt - displaced, pb - displaced));
    if (dot(dn, n) < 0.0) dn = -dn;

    vec4 world = modelMatrix * vec4(displaced, 1.0);
    vNormal = normalize(mat3(modelMatrix) * dn);
    vView = normalize(cameraPosition - world.xyz);
    vNoise = f;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const orbFragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uRim;
  uniform vec3 uCore;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;

  void main() {
    vec3 n = normalize(vNormal);
    float fres = pow(1.0 - max(dot(n, vView), 0.0), 2.4);
    vec3 base = mix(uA, uB, smoothstep(-0.35, 0.55, vNoise));
    // Faixas suaves, tipo reflexo iridescente.
    float bands = 0.5 + 0.5 * sin(vNoise * 9.0 + uTime * 0.8);
    vec3 col = mix(uCore, base, 0.45 + 0.25 * bands);
    // Luz de cima à esquerda.
    float light = max(dot(n, normalize(vec3(-0.5, 0.8, 0.6))), 0.0);
    col += base * light * 0.35;
    col = mix(col, uRim, fres);
    gl_FragColor = vec4(col, 1.0);
  }
`

function createOrb(ctx: StageContext) {
  const { renderer, pointer, reducedMotion } = ctx
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50)
  camera.position.set(0, 0, 11)

  const root = new THREE.Group()
  scene.add(root)

  const orbMat = new THREE.ShaderMaterial({
    vertexShader: orbVertex,
    fragmentShader: orbFragment,
    uniforms: {
      uTime: { value: 0 },
      uAmp: { value: 0.32 },
      uA: { value: new THREE.Color() },
      uB: { value: new THREE.Color() },
      uRim: { value: new THREE.Color() },
      uCore: { value: new THREE.Color() },
    },
  })
  const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.75, 48), orbMat)
  root.add(orb)

  const shellMat = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false })
  const shell = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.55, 1)), shellMat)
  root.add(shell)

  // Anel de partículas inclinado.
  const ringCount = 900
  const ringPos = new Float32Array(ringCount * 3)
  for (let i = 0; i < ringCount; i++) {
    const a = Math.random() * Math.PI * 2
    const r = 3.1 + (Math.random() - 0.5) * 0.7 * Math.random()
    ringPos[i * 3] = Math.cos(a) * r
    ringPos[i * 3 + 1] = (Math.random() - 0.5) * 0.12
    ringPos[i * 3 + 2] = Math.sin(a) * r
  }
  const ringGeo = new THREE.BufferGeometry()
  ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3))
  const ringMat = new THREE.PointsMaterial({ size: 0.035, sizeAttenuation: true, transparent: true, depthWrite: false })
  const ring = new THREE.Points(ringGeo, ringMat)
  ring.rotation.set(1.15, 0, 0.35)
  root.add(ring)

  const setPalette = (p: Palette) => {
    const u = orbMat.uniforms
    u.uA.value.copy(p.accent)
    u.uB.value.copy(p.accent2)
    u.uRim.value.copy(p.isLight ? p.accent : p.accentFg)
    // Miolo escuro no tema escuro; no claro, um tom de destaque mais suave.
    u.uCore.value.copy(p.isLight ? p.accentFg.clone().lerp(p.bg, 0.55) : p.bg.clone().lerp(p.accent, 0.25))
    shellMat.color.copy(p.isLight ? p.accent : p.accentFg)
    shellMat.opacity = p.isLight ? 0.35 : 0.28
    ringMat.color.copy(p.accent2)
    ringMat.opacity = p.isLight ? 0.9 : 0.75
  }
  setPalette(ctx.palette)

  const lastPointer = new THREE.Vector2()
  let agitation = 0

  return {
    resize(w: number, h: number) {
      camera.aspect = w / h
      const fit = 4 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
      camera.position.z = Math.max(fit, fit / camera.aspect)
      camera.updateProjectionMatrix()
    },
    frame(time: number, delta: number) {
      const t = reducedMotion ? 2 : time
      const speed = delta > 0 ? pointer.distanceTo(lastPointer) / delta : 0
      lastPointer.copy(pointer)
      agitation += (Math.min(speed * 0.08, 0.35) - agitation) * (1 - Math.pow(0.02, delta))

      orbMat.uniforms.uTime.value = t
      orbMat.uniforms.uAmp.value = 0.3 + agitation

      const k = 1 - Math.pow(0.02, delta)
      const tx = THREE.MathUtils.clamp(-pointer.y, -1.5, 1.5) * 0.35
      const ty = THREE.MathUtils.clamp(pointer.x, -1.5, 1.5) * 0.5
      root.rotation.x += (tx - root.rotation.x) * k
      root.rotation.y += (ty - root.rotation.y) * k

      orb.rotation.y = t * 0.12
      shell.rotation.set(t * 0.07, -t * 0.11, 0)
      ring.rotation.y = t * 0.18
      root.position.y = Math.sin(t * 0.8) * 0.12

      renderer.render(scene, camera)
    },
    setPalette,
    dispose() {
      disposeTree(scene)
    },
  }
}

export function mount(container: HTMLElement) {
  return mountStage(container, createOrb, { maxDpr: 1.75 })
}
