import { describe, it, expect } from 'vitest'
import { getUpstreamForms } from '../../src/utils/graph'

describe('getUpstreamForms', () => {
  it('returns direct upstream forms', () => {
    const edges = [{ from: 'A', to: 'B' }]

    const result = getUpstreamForms(edges, 'B')

    expect(result).toEqual(['A'])
  })

  it('returns transitive upstream forms (multi-level)', () => {
    const edges = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
    ]

    const result = getUpstreamForms(edges, 'D')

    expect(result).toEqual(['C', 'B', 'A'])
  })

  it('returns empty array if no upstream forms', () => {
    const edges = [{ from: 'A', to: 'B' }]

    const result = getUpstreamForms(edges, 'A')

    expect(result).toEqual([])
  })

  it('handles multiple branches correctly', () => {
    const edges = [
      { from: 'A', to: 'C' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'D' },
    ]

    const result = getUpstreamForms(edges, 'D')

    // Order may vary depending on DFS, so use arrayContaining
    expect(result).toEqual(expect.arrayContaining(['A', 'B', 'C']))
  })

  it('does not include duplicates', () => {
    const edges = [
      { from: 'A', to: 'C' },
      { from: 'A', to: 'C' },
      { from: 'C', to: 'D' },
    ]

    const result = getUpstreamForms(edges, 'D')

    const unique = new Set(result)
    expect(result.length).toBe(unique.size)
  })

  it('does not include the current form itself', () => {
    const edges = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
    ]

    const result = getUpstreamForms(edges, 'C')

    expect(result).not.toContain('C')
  })

  it('handles disconnected graph correctly', () => {
    const edges = [
      { from: 'A', to: 'B' },
      { from: 'X', to: 'Y' },
    ]

    const result = getUpstreamForms(edges, 'B')

    expect(result).toEqual(['A'])
  })

  it('handles circular dependency safely (should not infinite loop)', () => {
    const edges = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'A' }, // cycle
    ]

    const result = getUpstreamForms(edges, 'B')

    // Should still work without infinite recursion
    expect(result).toContain('A')
  })

  it('returns empty if form not in graph', () => {
    const edges = [{ from: 'A', to: 'B' }]

    const result = getUpstreamForms(edges, 'Z')

    expect(result).toEqual([])
  })
})
