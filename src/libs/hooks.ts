import { useRef, useEffect, useState } from 'react'
import request from './request'

export const useIsMounted = () => {
  const ref = useRef(false)
  useEffect(() => {
    ref.current = true
    return () => (ref.current = false)
  }, [])
  return () => ref.current
}

export function useFetch<T>(url: string) {
  const [data, setData] = useState(null as any)
  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  useEffect(() => {
    if (data || loading) {
      return
    }
    setLoading(true)
    request(url)
      .then(res => {
        if (!isMounted()) {
          return
        }
        setData(res.data)
        setLoading(false)
      })
      .catch(() => {
        if (isMounted()) {
          setLoading(false)
        }
      })
  })

  return { data: data as T, loading }
}
