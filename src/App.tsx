import { useState } from 'react'
import FormList from './components/FormList'
import PrefillPanel from './components/PrefillPanel'
import { useForms } from './hooks'
import type { FormNode, PrefillState } from './types'

function App() {
  const { data, loading, error } = useForms()
  const [selectedForm, setSelectedForm] = useState<FormNode | null>(null)
  const [prefillState, setPrefillState] = useState<PrefillState>({})

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  const forms = data?.nodes ?? []
  const edges = data?.edges ?? []

  return (
    <main style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
      <section style={{ minWidth: '220px' }}>
        <h2>Forms</h2>
        <FormList forms={forms} onSelect={setSelectedForm} />
      </section>

      <section>
        <h2>Selected Form</h2>
        <div>
          {selectedForm ? selectedForm.name : 'Select a form from the list'}
        </div>
        {selectedForm && (
          <PrefillPanel
            allForms={forms}
            edges={edges}
            selectedForm={selectedForm}
            prefillState={prefillState}
            setPrefillState={setPrefillState}
          />
        )}
      </section>
    </main>
  )
}

export default App
