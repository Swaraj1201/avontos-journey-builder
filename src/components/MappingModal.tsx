import type { FormNode, PrefillMapping } from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (mapping: PrefillMapping) => void
  availableForms: FormNode[]
}

export default function MappingModal({
  isOpen,
  onClose,
  onSelect,
  availableForms,
}: Props) {
  if (!isOpen) {
    return null
  }

  return (
    <div>
      <h4>Select Data Source</h4>
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
