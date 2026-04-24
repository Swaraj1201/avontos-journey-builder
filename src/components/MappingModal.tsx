import type { FormNode, PrefillMapping } from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (mapping: PrefillMapping) => void
  availableForms: FormNode[]
  fieldName: string
}

export default function MappingModal({
  isOpen,
  onClose,
  onSelect,
  availableForms,
  fieldName,
}: Props) {
  if (!isOpen) {
    return null
  }

  return (
    <div>
      <h4>Select source for {fieldName}</h4>
      <p>Choose upstream form field or global value</p>
      <button type="button" onClick={onClose}>
        Close
      </button>

      {availableForms.map((form) => (
        <div key={form.id}>
          <div>{form.name}</div>
          {form.fields.map((field) => (
            <div key={field.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect({
                    sourceType: 'form',
                    sourceFormId: form.id,
                    sourceFieldId: field.id,
                  })
                  onClose()
                }}
              >
                {field.name}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
