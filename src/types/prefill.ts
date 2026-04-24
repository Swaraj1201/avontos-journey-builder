export type SourceType = 'form' | 'global'

export interface PrefillMapping {
  sourceType: SourceType
  sourceFormId?: string
  sourceFieldId?: string
}

export type PrefillState = {
  [formId: string]: {
    [fieldId: string]: PrefillMapping
  }
}
