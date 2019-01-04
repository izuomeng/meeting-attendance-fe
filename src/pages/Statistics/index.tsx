import * as React from 'react'
import { useFetch } from '../../components/WithFetch'

const Statistics: React.FunctionComponent = () => {
  const { data, loading } = useFetch('/api/meetings')
  return (
    <div>
      {loading + ''}:{JSON.stringify(data)}
    </div>
  )
}

export default Statistics
