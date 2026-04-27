import { useState } from 'react'
import './App.css'
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
    <main className="app-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Forms</h2>
        <FormList
          forms={forms}
          selectedFormId={selectedForm?.id ?? null}
          onSelect={setSelectedForm}
        />
      </aside>

      <section className="main-panel">
        <div className="main-panel-header">
          <h2>{selectedForm ? selectedForm.name : 'Select a form'}</h2>
          <p className="main-panel-subtitle">Set up prefill behavior using upstream form data.</p>
        </div>
        {selectedForm ? (
          <PrefillPanel
            allForms={forms}
            edges={edges}
            selectedForm={selectedForm}
            prefillState={prefillState}
            setPrefillState={setPrefillState}
          />
        ) : (
          <div className="empty-state">Choose a form from the sidebar to configure prefill.</div>
        )}
      </section>
    </main>
  )
}

export default App
