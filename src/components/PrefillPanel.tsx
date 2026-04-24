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
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null)
  const formMappings = prefillState[selectedForm.id] ?? {}
  const formNameById = useMemo(
    () => Object.fromEntries(allForms.map((form) => [form.id, form.name])),
    [allForms],
  )
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
        const sourceFormName =
          mapping?.sourceFormId && formNameById[mapping.sourceFormId]
            ? formNameById[mapping.sourceFormId]
            : mapping?.sourceFormId
        const mappingText = mapping
          ? mapping.sourceType === 'form'
            ? `${sourceFormName ?? 'Unknown form'}.${mapping.sourceFieldId ?? 'Unknown field'}`
            : 'Global source'
          : 'Click to map'

        return (
          <div
            key={field.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 6px',
              borderRadius: '4px',
            }}
          >
            <button
              type="button"
              style={{
                cursor: isMapped ? 'default' : 'pointer',
                backgroundColor:
                  !isMapped && hoveredFieldId === field.id ? '#ececec' : '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '2px 6px',
              }}
              onMouseEnter={() => setHoveredFieldId(field.id)}
              onMouseLeave={() => setHoveredFieldId(null)}
              onClick={() => {
                if (!isMapped) {
                  setActiveFieldId(field.id)
                }
              }}
            >
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
        fieldName={selectedForm.fields.find((field) => field.id === activeFieldId)?.name ?? 'field'}
      />
    </div>
  )
}
