import type { GraphResponse } from '../types'

const FORMS_ENDPOINT =
  'http://localhost:3000/api/v1/demo/actions/blueprints/demo/graph'

export async function fetchForms(): Promise<GraphResponse> {
  const res = await fetch(FORMS_ENDPOINT)

  if (!res.ok) {
    throw new Error(`Failed to fetch forms: ${res.status} ${res.statusText}`)
  }

  return (await res.json()) as GraphResponse
}
