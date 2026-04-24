import type { Edge } from './edge'
import type { FormNode } from './form-node'

export interface GraphResponse {
  nodes: FormNode[]
  edges: Edge[]
}
