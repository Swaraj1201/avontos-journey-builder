import { useEffect, useState } from 'react'
import { fetchForms } from '../services'
import type { GraphResponse } from '../types'

export function useForms() {
  const [data, setData] = useState<GraphResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadForms() {
      try {
        const response = await fetchForms()

        if (!isMounted) {
          return
        }

        setData(response)
      } catch (err) {
        if (!isMounted) {
          return
        }

        const message =
          err instanceof Error ? err.message : 'Failed to fetch forms'
        setError(message)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadForms()

    return () => {
      isMounted = false
    }
  }, [])

  return { data, loading, error }
}
