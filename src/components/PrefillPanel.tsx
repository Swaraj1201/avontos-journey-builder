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

  const mappedFields = selectedForm.fields.filter((field) => Boolean(formMappings[field.id]))

  return (
    <div className="prefill-panel">
      <div className="prefill-panel-title-wrap">
        <h3 className="prefill-panel-title">Configure Prefill</h3>
      </div>
      <div className="prefill-steps">
        <p className="prefill-step-text">1. Select a field</p>
        <p className="prefill-step-text">2. Choose a source from upstream forms</p>
      </div>
      <div className="prefill-configured-section">
        <h4 className="prefill-configured-title">Configured Prefill Rules</h4>
        {mappedFields.length === 0 ? (
          <p className="prefill-configured-empty">
            No fields configured yet.
            <br />
            Click a field above to start mapping.
          </p>
        ) : (
          mappedFields.map((field) => {
            const mapping = formMappings[field.id]
            if (!mapping) {
              return null
            }
            const sourceFormName =
              mapping.sourceFormId && formNameById[mapping.sourceFormId]
                ? formNameById[mapping.sourceFormId]
                : mapping.sourceFormId
            const ruleText =
              mapping.sourceType === 'form'
                ? `Auto-filled from ${sourceFormName ?? 'Unknown form'}'s ${formatFieldName(getSourceFieldName(mapping))} field`
                : `Auto-filled from Global data ${formatFieldName(mapping.sourceFieldId ?? 'Unknown field')}`

            return (
              <p key={field.id} className="prefill-configured-item">
                {formatFieldName(field.name)} field {'->'} {ruleText}
              </p>
            )
          })
        )}
      </div>
      <div className="prefill-fields-list">
        {selectedForm.fields.map((field) => {
          const mapping = formMappings[field.id]
          const isMapped = Boolean(mapping)
          const sourceFormName =
            mapping?.sourceFormId && formNameById[mapping.sourceFormId]
              ? formNameById[mapping.sourceFormId]
              : mapping?.sourceFormId
          const mappingText = mapping
            ? mapping.sourceType === 'form'
              ? `Auto-filled from ${sourceFormName ?? 'Unknown form'}'s ${formatFieldName(getSourceFieldName(mapping))} field`
              : `Auto-filled from Global data ${formatFieldName(mapping.sourceFieldId ?? 'Unknown field')}`
            : 'Click to map'

          return (
            <div
              key={field.id}
              className={`prefill-row ${isMapped ? 'prefill-row-mapped' : ''} ${highlightedFieldId === field.id ? 'prefill-row-highlight' : ''}`}
              onClick={() => {
                setActiveFieldId(field.id)
              }}
            >
              <div className="prefill-row-content">
                <div className="prefill-field-name">
                  {isMapped ? '✔ ' : ''}
                  {formatFieldName(field.name)} field
                </div>
                <div className="prefill-mapping-text">{mappingText}</div>
              </div>
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
      </div>

      <MappingModal
        isOpen={Boolean(activeFieldId)}
        onClose={() => setActiveFieldId(null)}
        onSelect={handleSelectMapping}
        availableForms={availableForms}
        fieldName={selectedForm.fields.find((field) => field.id === activeFieldId)?.name ?? 'field'}
        targetFieldId={activeFieldId}
        currentFormId={selectedForm.id}
      />
    </div>
  )
}
