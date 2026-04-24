import type { Edge } from '../types'

export function getUpstreamForms(
  edges: Edge[],
  currentFormId: string,
): string[] {
  const visited = new Set<string>()

  function dfs(current: string): void {
    for (const edge of edges) {
      if (edge.to === current && !visited.has(edge.from)) {
        visited.add(edge.from)
        dfs(edge.from)
      }
    }
  }

  dfs(currentFormId)
  return Array.from(visited)
}
