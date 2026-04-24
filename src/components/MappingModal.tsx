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
    <div className="mapping-modal">
      <h4>Select source for {fieldName}</h4>
      <p>Choose upstream form field or global value</p>
      <p className="mapping-modal-section-label">Available data sources</p>
      <p className="mapping-modal-helper-text">Select a field to map value from</p>
      <button type="button" onClick={onClose}>
        Close
      </button>

      {availableForms.map((form) => (
        <div key={form.id} className="mapping-modal-form-group">
          <div className="mapping-modal-form-name">{form.name}</div>
          {form.fields.map((field) => (
            <div key={field.id}>
              <button
                type="button"
                className="mapping-modal-option"
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
