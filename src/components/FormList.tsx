import type { FormNode } from '../types'

interface Props {
  forms: FormNode[]
  onSelect: (form: FormNode) => void
}

export default function FormList({ forms, onSelect }: Props) {
  return (
    <div>
      {forms.map((form) => (
        <div key={form.id} onClick={() => onSelect(form)}>
          {form.name}
        </div>
      ))}
    </div>
  )
}
