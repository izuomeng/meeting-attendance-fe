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

type Data = {
  response: object | null
  loading: boolean
  fetchData: (newParams?: object, id?: string) => void
}

type Props = {
  url: string | string[]
  params: object | object[]
  children: (args: Data) => JSX.Element
}

const initialState = {
  data: null,
  loading: false
}

type State = Readonly<typeof initialState>

class WithFetch extends PureComponent<Props, State> {
  readonly state: State = initialState
  componentDidMount() {
    this.fetchData()
  }
  componentDidUpdate(prevProps: Props) {
    if (!isEqual(prevProps.url, this.props.url) || !isEqual(prevProps.params, this.props.params)) {
      this.fetchData()
    }
  }

  fetchData = (
    newParams?: object,
    id?: string /* 多个url时使用，不指定id则会把url里的都请求一遍，id为对应的数组下标 */
  ) => {
    this.setState({ loading: true }, async () => {
      let { url, params } = this.props
      let data
      try {
        if (typeof url === 'string') {
          data = await request(url, { params: newParams || params })
        } else if (Array.isArray(url)) {
          if (params && !Array.isArray(params)) {
            throw new Error('url和params必须同时为数组')
          }
          params = params || []
          if (typeof id === 'number') {
            data = await request(url[id], { params: newParams || params[id] })
          } else {
            newParams = newParams || []
            data = await Promise.all(
              url.map((v, i) => request(v, { params: (newParams && newParams[i]) || params[i] }))
            )
          }
        }
      } finally {
        this.setState({ data, loading: false })
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
