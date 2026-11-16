let counter = 0;

/** Small, dependency-free id generator (unique within a session). */
export function createId(prefix = 'id'): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}
