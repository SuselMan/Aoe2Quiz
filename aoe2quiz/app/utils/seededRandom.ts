/**
 * Mulberry32 seeded PRNG. Returns a function that yields 0..1.
 * Same seed => same sequence on all clients for multiplayer sync.
 */
export function createSeededRandom(seed: number): () => number {
  return function mulberry32() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
