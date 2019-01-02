import { message } from 'antd'
import { stringify } from 'qs'

function isFormData(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object FormData]'
}

function isEmpty(val: any): boolean {
  return val === undefined || val === null || val === ''
}

function shake(obj: object = {}) {
  return Object.keys(obj).reduce(
    (result, key) =>
      !isEmpty(obj[key]) ? ((result[key] = obj[key]), result) : result,
    {}
  )
}

/**
 * 功能更强大的request
 *
 * @param {string} url - 请求的path
 * @param {Object} option - 配置信息
 * @example
 * get请求: const data = await requestUrl('/api/list', { params: { id: 123 } })
 * post请求: const result = await requestUrl('/api/user', { method: 'post', data: { name: 'Tom' } })
 */
type Config = Partial<{
  headers: Record<string, string> | undefined
  data: object | FormData
  params: object
  method: 'get' | 'post' | 'put' | 'delete'
  type: string
}>

type Options = Partial<{
  credentials: 'include' | 'omit' | 'same-origin' | undefined
  method: 'get' | 'post' | 'put' | 'delete'
  headers: Record<string, string> | undefined
  body: FormData | string | null | undefined
}>

export interface IResponse<T> {
  status: number
  message: string
  data: T
}

async function request<T>(url: string, config: Config = {}) {
  const { headers = {}, method = 'get', type = 'urlencoded' } = config
  const jsonHeaders = {
    'Content-Type': 'application/json; charset=utf-8'
  }
  const formUrlEncodedHEaders = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  const options: Options = {
    credentials: 'include',
    method
  }

  let { data, params } = config
  let fetchUrl = url

  if (params) {
    params = shake(params)
  }
  if (data) {
    data = shake(data)
  }

  // 自动封装get请求的url
  if (method === 'get') {
    const searchParam = stringify(params || data)
    const wrappedUrl = url.includes('?') ? `${url}&` : `${url}?`
    fetchUrl = searchParam ? `${wrappedUrl}${searchParam}` : url
    options.headers = headers
  } else if (isFormData(data)) {
    options.headers = headers
    options.body = data as FormData
  } else if (type === 'json') {
    // 处理json编码的post等请求
    options.headers = {
      ...jsonHeaders,
      ...headers
    }
    options.body = JSON.stringify(data)
  } else if (type === 'urlencoded') {
    // 处理url编码的post等请求
    options.headers = {
      ...formUrlEncodedHEaders,
      ...headers
    }
    options.body = stringify(data)
  }
  try {
    const response = await fetch(fetchUrl, options)
    const result: IResponse<T> = await response.json()
    // 新标准
    if (result.status === 0) {
      return result
    } else {
      const errorMsg = result.message || `错误: ${result.status}`
      throw new Error(errorMsg)
    }
  } catch (error) {
    message.error(error.toString())
    throw new Error(error)
  }
}

export default request
