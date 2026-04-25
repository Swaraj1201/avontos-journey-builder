import { useEffect, useMemo, useState } from 'react'
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
  const [highlightedFieldId, setHighlightedFieldId] = useState<string | null>(null)
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
  const fieldNameByFormId = useMemo(
    () =>
      Object.fromEntries(
        allForms.map((form) => [
          form.id,
          Object.fromEntries(form.fields.map((field) => [field.id, field.name])),
        ]),
      ),
    [allForms],
  )

  useEffect(() => {
    if (!highlightedFieldId) {
      return
    }

    const timeout = window.setTimeout(() => {
      setHighlightedFieldId(null)
    }, 1200)

    return () => window.clearTimeout(timeout)
  }, [highlightedFieldId])

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
    setHighlightedFieldId(activeFieldId)
    setActiveFieldId(null)
  }

  function formatFieldName(fieldName: string): string {
    if (!fieldName) {
      return 'Field'
    }

    return fieldName
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(' ')
  }

  function getSourceFieldName(mapping: PrefillMapping): string {
    if (!mapping.sourceFormId || !mapping.sourceFieldId) {
      return 'Unknown field'
    }

    return fieldNameByFormId[mapping.sourceFormId]?.[mapping.sourceFieldId] ?? mapping.sourceFieldId
  }

  return (
    <div className="prefill-panel">
      <h3>{selectedForm.name}</h3>
      <p className="prefill-step-text">Step 1: Select a field to configure</p>
      <p className="prefill-step-text">Step 2: Choose a source from upstream forms</p>
      {selectedForm.fields.map((field) => {
        const mapping = formMappings[field.id]
        const isMapped = Boolean(mapping)
        const sourceFormName =
          mapping?.sourceFormId && formNameById[mapping.sourceFormId]
            ? formNameById[mapping.sourceFormId]
            : mapping?.sourceFormId
        const mappingText = mapping
          ? mapping.sourceType === 'form'
            ? `${formatFieldName(field.name)} field -> Prefilled from ${sourceFormName ?? 'Unknown form'} -> ${formatFieldName(getSourceFieldName(mapping))}`
            : 'Global source'
          : `${formatFieldName(field.name)} field -> Click to map`

        return (
          <div
            key={field.id}
            className={`prefill-row ${isMapped ? 'prefill-row-mapped' : ''} ${highlightedFieldId === field.id ? 'prefill-row-highlight' : ''}`}
            onClick={() => {
              setActiveFieldId(field.id)
            }}
          >
            <span>{isMapped ? `✔ ${mappingText}` : mappingText}</span>
            {isMapped && (
              <button
                type="button"
                className="prefill-remove-btn"
                onClick={(event) => {
                  event.stopPropagation()
                  handleRemoveMapping(field.id)
                }}
              >
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
