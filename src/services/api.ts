import type { GraphResponse } from '../types'

const FORMS_ENDPOINT =
  '/api/v1/demo/actions/blueprints/demo/graph'

interface RawNode {
  id: string
  data?: {
    name?: string
    prerequisites?: string[]
  }
}

interface RawGraphResponse {
  nodes?: RawNode[]
}

export async function fetchForms(): Promise<GraphResponse> {
  const res = await fetch(FORMS_ENDPOINT, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch forms: ${res.status} ${res.statusText}`)
  }

  const raw = (await res.json()) as RawGraphResponse
  const rawNodes = raw.nodes ?? []

  const nodes = rawNodes.map((node) => ({
    id: node.id,
    name: node.data?.name || 'Unnamed Form',
    fields: [
      { id: 'email', name: 'email' },
      { id: 'name', name: 'name' },
      { id: 'id', name: 'id' },
    ],
  }))

  const edges = rawNodes.flatMap((node) =>
    (node.data?.prerequisites ?? []).map((fromId) => ({
      from: fromId,
      to: node.id,
    })),
  )

  return { nodes, edges }
}
