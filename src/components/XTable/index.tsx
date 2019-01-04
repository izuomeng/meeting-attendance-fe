import * as React from 'react'
import { Table } from 'antd'
import { isEqual } from 'lodash'
import request, { IResponse } from '../../libs/request'
import { EditableRow, EditableCell, EditableContext } from './Editable'
import { CSSObject } from 'styled-components'

export interface IColumnBase {
  dataIndex: string
  title?: string
  children?: IColumn[]
  width?: number
  render?: (text: any, record: object, index: number) => React.ReactNode
  onCell?: (record: any) => any
}

export interface IColumn extends IColumnBase {
  type?: string
  filters?: Array<{ text: string; value: string }>
  editable?: { render: IColumnBase['render'] }
  fitFilter?: (value: string) => object
}

export interface IRefs {
  fetchData: (newParams?: object) => void
}

export interface IProps {
  columns: IColumn[]
  url: string
  params?: any
  style?: CSSObject
  className?: string
  rowKey?: string
  pagination?: object
  expandedRowRender?: React.FunctionComponent
  refer?: (ref: IRefs) => void
  processData?: (response: any) => IResponse<any>
  beforeFetch?: () => object
  onSave?: (row: object, utils: { feSave: () => void }) => void
  onChange?: (pagination: object, filter: object, sorter: object) => void
}

interface IResponseData {
  list: object[]
  current_page: number
  page_size: number
  total: number
}

const initialState = {
  currentPage: 1,
  data: [] as object[],
  editingIndex: -1,
  loading: false,
  pageSize: 10,
  total: 0
}

type State = Readonly<typeof initialState>

class XTable extends React.PureComponent<IProps, State> {
  readonly state = initialState
  filters = {}
  isMount = true

  componentDidMount() {
    const { refer } = this.props
    this.fetchData()
    // 向外暴露操作表格的方法
    if (typeof refer === 'function') {
      refer({
        fetchData: this.fetchData
      })
    }
  }
  componentDidUpdate(prevProps: IProps) {
    const { params, url } = this.props

    if (!isEqual(prevProps.params, params) || prevProps.url !== url) {
      this.setState({ currentPage: 1 }, () => this.fetchData())
    }
  }
  componentWillUnmount() {
    this.isMount = false
  }

  // 一般情况下只有一层，暂不考虑多层的情况
  handleChildrenColumn(columns: IColumn[]) {
    return columns.reduce(
      (result, item) => result.concat(item.children || item),
      [] as IColumn[]
    )
  }

  processFilter() {
    const columns = this.handleChildrenColumn(this.props.columns)

    return Object.keys(this.filters).reduce((result, key) => {
      const column = columns.find(col => col.dataIndex === key)
      const fitFilter = column && column.fitFilter
      // 处理filter参数，可自定义，默认直接转成json字符串
      if (typeof fitFilter === 'function') {
        result = { ...result, ...fitFilter(this.filters[key]) }
      } else {
        result[key] = JSON.stringify(
          this.filters[key].length > 0 ? this.filters[key] : undefined
        )
      }
      return result
    }, {})
  }

  fetchData = (newParams?: object) => {
    this.setState({ loading: true }, async () => {
      try {
        if (!this.props.url) {
          return
        }

        const { url, processData, params, beforeFetch, columns } = this.props
        const { currentPage, pageSize } = this.state
        const hasFilter = columns.some(col => !!col.filters)
        let requestParams = newParams ? { ...params, ...newParams } : params

        // 如果有过滤，自动加上过滤的请求参数
        if (hasFilter) {
          requestParams = { ...this.processFilter(), ...requestParams }
        }
        // 发出请求前看看有没有要补充的参数
        if (typeof beforeFetch === 'function') {
          requestParams = { ...requestParams, ...beforeFetch() }
        }
        let result = await request<IResponseData>(url, {
          params: {
            ...requestParams,
            current_page: newParams ? 1 : currentPage,
            page_size: pageSize
          }
        })
        // 如果后端返回的格式不对，这里还可以补救一下
        if (typeof processData === 'function') {
          result = processData(result)
        }
        const { data } = result
        if (!this.isMount) {
          return
        }
        this.setState({
          currentPage: data.current_page || currentPage,
          data: data.list || [],
          pageSize: data.page_size || pageSize,
          total:
            data.total !== undefined
              ? data.total
              : (data.list && data.list.length) || 0
        })
      } finally {
        if (this.isMount) {
          this.setState({ loading: false })
        }
      }
    })
  }

  onPagination = (
    currentPage: number,
    pageSize: number = this.state.pageSize
  ) => {
    if (
      currentPage === this.state.currentPage &&
      pageSize === this.state.pageSize
    ) {
      return
    }
    this.setState({ currentPage, pageSize }, () => this.fetchData())
  }

  edit(index: number) {
    this.setState({ editingIndex: index })
  }

  save(form: any, index: number, record: any) {
    form.validateFields((error: any, values: object) => {
      if (error) {
        return
      }
      const { onSave } = this.props
      const isSame = Object.keys(values).every(
        key => values[key] === record[key]
      )

      if (isSame) {
        this.setState({ editingIndex: -1 })
        return
      }

      if (typeof onSave === 'function') {
        onSave(
          { ...this.state.data[index], ...values },
          {
            feSave: () =>
              this.setState({
                data: this.state.data.map((v, i) =>
                  i === index ? { ...v, ...values } : v
                )
              })
          }
        )
      }
      this.setState({ editingIndex: -1 })
    })
  }

  cancel = () => {
    this.setState({ editingIndex: -1 })
  }

  getActionColumn(userActionColumn = {} as IColumn): IColumn {
    return {
      dataIndex: '_operation',
      render: (text, record, index) => {
        const editable = this.state.editingIndex === index
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {({ form }: any) => (
                    <a
                      onClick={() => this.save(form, index, record)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                <a onClick={() => this.cancel()}>取消</a>
              </span>
            ) : (
              <a onClick={() => this.edit(index)}>编辑</a>
            )}
            {typeof userActionColumn.render === 'function' &&
              userActionColumn.render(text, record, index)}
          </div>
        )
      },
      title: '操作',
      width: userActionColumn.width || 100
    }
  }

  processColumns(): IColumn[] {
    // 处理某些特殊的column，比如自增索引列
    const { columns } = this.props
    let hasEditableColumn = false
    let newColumns = columns.map(
      (column): IColumn => {
        if (column.type === 'index') {
          return {
            ...column,
            render: (t, r, index) => index + 1
          }
        } else if (column.editable) {
          hasEditableColumn = true
          return {
            ...column,
            onCell: record => ({
              dataIndex: column.dataIndex,
              editingIndex: this.state.editingIndex,
              record,
              title: column.title,
              ...column.editable
            })
          }
        }
        return column
      }
    )
    // 如果用户有自己的操作列，将其与自动生成的合并
    if (hasEditableColumn) {
      const actionColumn = columns.find(col => col.type === 'action')
      if (actionColumn) {
        // 去掉用字自己的action列
        newColumns = newColumns.filter(col => col.type !== 'action')
      }
      // 替换成包装后的action列
      newColumns.push(this.getActionColumn(actionColumn))
    }

    return newColumns
  }

  handleChange = (pagination: object, filters: object, sorter: object) => {
    if (!isEqual(filters, this.filters)) {
      this.filters = filters
      this.fetchData()
    }
    const { onChange } = this.props
    if (typeof onChange === 'function') {
      onChange(pagination, filters, sorter)
    }
  }

  render() {
    const { data, loading, currentPage, pageSize, total } = this.state
    // 把props中不需要透传给表格的属性剥离出来
    const {
      columns,
      rowKey,
      url,
      refer,
      pagination,
      onChange,
      ...rest
    } = this.props

    const defaultPagination = {
      current: currentPage,
      onChange: this.onPagination,
      onShowSizeChange: this.onPagination,
      pageSize,
      pageSizeOptions: ['10', '20', '30', '40'],
      showSizeChanger: true,
      total
    }
    return (
      <React.Fragment>
        <Table
          rowKey={rowKey || (record => record.id || JSON.stringify(record))}
          loading={loading}
          dataSource={data}
          columns={this.processColumns()}
          pagination={pagination !== undefined ? pagination : defaultPagination}
          components={{
            body: {
              cell: EditableCell,
              row: EditableRow
            }
          }}
          onRow={(_, index) => ({ index })}
          onChange={this.handleChange}
          {...rest}
        />
      </React.Fragment>
    )
  }
}

export default XTable
