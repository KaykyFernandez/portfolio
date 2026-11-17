// Lê a preferência "reduzir movimento" do sistema operacional.
export function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}
