import { describe, it, expect } from 'vitest';
import { mapActionToE } from '../src/server/arelogic/event.mapper';

describe('Event Mapper (Continuous Ingestion)', () => {
  it('should return correct vector for "harvest"', () => {
    const E = mapActionToE('harvest');
    expect(E).toEqual([0.5,0.2,0,0,0,0,0.3,0,0,0,0,0,0]);
  });

  it('should return correct vector for "combat"', () => {
    const E = mapActionToE('combat');
    expect(E).toEqual([0,0.1,0.2,0.2,0,0,0,0,0.2,0,0,0,0]);
  });

  it('should return correct vector for "govern"', () => {
    const E = mapActionToE('govern');
    expect(E).toEqual([0,0,0,0,0.2,0,0,0,0.3,0.2,0.8,0.2,0]);
  });

  it('should return zeroed 13-length array for unknown action', () => {
    const E = mapActionToE('unknown_action');
    expect(E).toEqual(new Array(13).fill(0));
    expect(E.length).toBe(13);
  });
});
