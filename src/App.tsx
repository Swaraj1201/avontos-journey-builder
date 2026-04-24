import { useState } from 'react'
import FormList from './components/FormList'
import { useForms } from './hooks'
import type { FormNode } from './types'

function App() {
  const { data, loading, error } = useForms()
  const [selectedForm, setSelectedForm] = useState<FormNode | null>(null)

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  const forms = data?.nodes ?? []

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
      </section>
    </main>
  )
}

export default App
