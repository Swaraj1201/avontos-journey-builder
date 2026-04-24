export interface Field {
  id: string
  name: string
}

export interface FormNode {
  id: string
  name: string
  fields: Field[]
}

export interface Edge {
  from: string
  to: string
}

export interface GraphResponse {
  nodes: FormNode[]
  edges: Edge[]
}
