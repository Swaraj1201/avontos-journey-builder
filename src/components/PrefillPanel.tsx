import type { Dispatch, SetStateAction } from 'react'
import type { FormNode, PrefillState } from '../types'

interface Props {
  selectedForm: FormNode
  prefillState: PrefillState
  setPrefillState: Dispatch<SetStateAction<PrefillState>>
}

export default function PrefillPanel({
  selectedForm,
  prefillState,
  setPrefillState,
}: Props) {
  const formMappings = prefillState[selectedForm.id] ?? {}

  function handleRemoveMapping(fieldId: string): void {
    setPrefillState((prev) => {
      const currentFormMappings = prev[selectedForm.id] ?? {}
      const { [fieldId]: _removed, ...remainingMappings } = currentFormMappings

      return {
        ...prev,
        [selectedForm.id]: remainingMappings,
      }
    })
  }

  return (
    <div>
      <h3>{selectedForm.name}</h3>
      {selectedForm.fields.map((field) => {
        const mapping = formMappings[field.id]
        const isMapped = Boolean(mapping)
        const mappingText = mapping
          ? mapping.sourceType === 'form'
            ? `${mapping.sourceFormId ?? 'Unknown form'}.${mapping.sourceFieldId ?? 'Unknown field'}`
            : 'Global source'
          : 'No mapping'

        return (
          <div key={field.id}>
            <span>{field.name}</span>
            <span>{' -> '}</span>
            <span>{mappingText}</span>
            {isMapped && (
              <button type="button" onClick={() => handleRemoveMapping(field.id)}>
                X
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
