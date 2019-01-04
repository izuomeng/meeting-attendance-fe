/**
 * HOC，使用renderProp的形式来封装请求
 * @example
 * <WithFetch url="/api" params={{ id:123 }}>
 *   {({response, loading}) => {
 *     if (loading) return <Loading />
 *     retrurn <div>{response.data}</div>
 *   }}
 * </WithFetch>
 */
import * as React from 'react'
import { isEqual } from 'lodash'
import request from '../../libs/request'
import { useIsMounted } from '../../libs/hooks'
import Loading from '../../components/Loading'

interface IProps<T> {
  url: string
  params?: object
  children: (
    args: {
      response: { data: T } | null
      loading: boolean
      fetchData: (newParams?: object, id?: string) => void
    }
  ) => React.ReactNode
}

interface IPropsSimple<T> {
  url: string
  loading?: boolean // 没有数据的时候是否展示Loading
  params?: object
  children: (data: T) => React.ReactNode
}

const initialState = {
  data: null as any,
  loading: false
}

type State = Readonly<typeof initialState>

class WithFetch<T> extends React.PureComponent<IProps<T>, State> {
  readonly state: State = initialState
  isMount = true

  componentDidMount() {
    this.fetchData()
  }
  componentDidUpdate(prevProps: IProps<T>) {
    if (
      !isEqual(prevProps.url, this.props.url) ||
      !isEqual(prevProps.params, this.props.params)
    ) {
      this.fetchData()
    }
  }
  componentWillUnmount() {
    this.isMount = false
  }

  fetchData = (newParams?: object) => {
    this.setState({ loading: true }, async () => {
      const { url, params } = this.props
      try {
        const data = await request<any>(url, { params: newParams || params })
        if (this.isMount) {
          this.setState({ data })
        }
      } finally {
        if (this.isMount) {
          this.setState({ loading: false })
        }
      }
    })
  }

  render() {
    const { children } = this.props
    const { data, loading } = this.state
    return children({ response: data, loading, fetchData: this.fetchData })
  }
}

export const WithFetchSimple: React.SFC<IPropsSimple<any>> = ({
  children,
  loading: showLoading = false,
  ...rest
}) => (
  <WithFetch<any> {...rest}>
    {({ response, loading }) => {
      if (!response || loading) {
        return showLoading ? <Loading /> : null
      }
      return children(response.data)
    }}
  </WithFetch>
)

export function useFetch(url: string) {
  const [data, setData] = React.useState(null as any)
  const [loading, setLoading] = React.useState(false)
  const isMounted = useIsMounted()

  React.useEffect(() => {
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

  return { data, loading }
}

export default WithFetch
