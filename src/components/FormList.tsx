import type { FormNode } from '../types'

interface Props {
  forms: FormNode[]
  selectedFormId: string | null
  onSelect: (form: FormNode) => void
}

export default function FormList({ forms, selectedFormId, onSelect }: Props) {
  return (
    <div className="forms-list">
      {forms.map((form) => (
        <button
          key={form.id}
          type="button"
          className={`form-list-item ${selectedFormId === form.id ? 'selected' : ''}`}
          onClick={() => onSelect(form)}
        >
          {form.name}
        </button>
      ))}
    </div>
  )
}
