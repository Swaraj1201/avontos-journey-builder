import type { Field } from './field'

export interface FormNode {
  id: string
  name: string
  fields: Field[]
}
