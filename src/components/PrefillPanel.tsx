import { useMemo, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import MappingModal from './MappingModal'
import { getUpstreamForms } from '../utils'
import type { Edge, FormNode, PrefillMapping, PrefillState } from '../types'

interface Props {
  allForms: FormNode[]
  edges: Edge[]
  selectedForm: FormNode
  prefillState: PrefillState
  setPrefillState: Dispatch<SetStateAction<PrefillState>>
}

export default function PrefillPanel({
  allForms,
  edges,
  selectedForm,
  prefillState,
  setPrefillState,
}: Props) {
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
  const formMappings = prefillState[selectedForm.id] ?? {}
  const upstreamFormIds = useMemo(
    () => getUpstreamForms(edges, selectedForm.id),
    [edges, selectedForm.id],
  )
  const availableForms = useMemo(
    () => allForms.filter((form) => upstreamFormIds.includes(form.id)),
    [allForms, upstreamFormIds],
  )

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

  function handleSelectMapping(mapping: PrefillMapping): void {
    if (!activeFieldId) {
      return
    }

    setPrefillState((prev) => {
      const currentFormMappings = prev[selectedForm.id] ?? {}

      return {
        ...prev,
        [selectedForm.id]: {
          ...currentFormMappings,
          [activeFieldId]: mapping,
        },
      }
    })
    setActiveFieldId(null)
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
            <button type="button" onClick={() => setActiveFieldId(field.id)}>
              {field.name}
            </button>
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

      <MappingModal
        isOpen={Boolean(activeFieldId)}
        onClose={() => setActiveFieldId(null)}
        onSelect={handleSelectMapping}
        availableForms={availableForms}
      />
    </div>
  )
}
