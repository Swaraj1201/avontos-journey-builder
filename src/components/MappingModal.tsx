import type { FormNode, PrefillMapping } from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (mapping: PrefillMapping) => void
  availableForms: FormNode[]
  fieldName: string
  targetFieldId: string | null
  currentFormId: string
}

export default function MappingModal({
  isOpen,
  onClose,
  onSelect,
  availableForms,
  fieldName,
  targetFieldId,
  currentFormId,
}: Props) {
  const globalFields = ['currentUser.email', 'currentUser.id']
  const upstreamOptions = availableForms
    .filter((form) => form.id !== currentFormId)
    .map((form) => ({
      ...form,
      fields: form.fields.filter((field) => field.id === targetFieldId),
    }))
    .filter((form) => form.fields.length > 0)
  const hasUpstreamForms = upstreamOptions.length > 0

  if (!isOpen) {
    return null
  }

  return (
    <div className="mapping-modal">
      <h4>Select source for {fieldName}</h4>
      <p className="mapping-modal-hint">You can only map data from forms that come before this one.</p>
      <p className="mapping-modal-helper-text">Choose where to get this value from.</p>
      {hasUpstreamForms ? (
        <div className="mapping-modal-section">
          <p className="mapping-modal-section-label">From previous forms</p>
          {upstreamOptions.map((form) => (
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
      ) : (
        <div className="mapping-modal-empty-state">
          <p className="mapping-modal-empty-title">No upstream forms available for this form.</p>
        </div>
      )}

      <div className="mapping-modal-section">
        <p className="mapping-modal-section-label">Global Data</p>
        <div className="mapping-modal-form-group">
          {globalFields.map((fieldId) => (
            <div key={fieldId}>
              <button
                type="button"
                className="mapping-modal-option"
                onClick={() => {
                  onSelect({
                    sourceType: 'global',
                    sourceFieldId: fieldId,
                  })
                  onClose()
                }}
              >
                {fieldId}
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="mapping-modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  )
}
