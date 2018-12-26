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
import { PureComponent } from 'react'
import { isEqual } from 'lodash'
import request from '../../libs/request'

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

const initialState = {
  data: null as any,
  loading: false
}

type State = Readonly<typeof initialState>

class WithFetch<T> extends PureComponent<IProps<T>, State> {
  readonly state: State = initialState

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

  fetchData = (newParams?: object) => {
    this.setState({ loading: true }, async () => {
      const { url, params } = this.props
      try {
        const data = await request<any>(url, { params: newParams || params })
        this.setState({ data })
      } finally {
        this.setState({ loading: false })
      }
    })
  }

  render() {
    const { children } = this.props
    const { data, loading } = this.state
    return children({ response: data, loading, fetchData: this.fetchData })
  }
}

export default WithFetch
