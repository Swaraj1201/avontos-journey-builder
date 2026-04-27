import type { Edge } from '../types'

export function getUpstreamForms(
  edges: Edge[],
  currentFormId: string,
): string[] {
  const visited = new Set<string>()
  const traversed = new Set<string>()

  function dfs(current: string): void {
    if (traversed.has(current)) {
      return
    }
    traversed.add(current)

    for (const edge of edges) {
      if (
        edge.to === current &&
        edge.from !== currentFormId &&
        !visited.has(edge.from)
      ) {
        visited.add(edge.from)
        dfs(edge.from)
      }
    }
  }

  dfs(currentFormId)
  return Array.from(visited)
}
