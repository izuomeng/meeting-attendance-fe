import * as React from 'react'
import { Form } from 'antd'

interface IEditableRowProps {
  form: any
  index: number
}

interface IEditableCellProps {
  editingIndex: number
  render?: (record: object, index: number) => React.ReactNode
  rules?: object[]
  dataIndex: string
  record: object
}

const FormItem = Form.Item

export const EditableContext = React.createContext({})

export const EditableRow = Form.create()(
  ({ form, index, ...props }: IEditableRowProps) => (
    <EditableContext.Provider value={{ form, index }}>
      <tr {...props} />
    </EditableContext.Provider>
  )
)

export const EditableCell: React.SFC<IEditableCellProps> = ({
  editingIndex,
  render,
  rules,
  dataIndex,
  record,
  ...restProps
}) => (
  <EditableContext.Consumer>
    {({ form, index }: IEditableRowProps) => {
      const { getFieldDecorator } = form
      return record && editingIndex === index ? (
        <td {...restProps}>
          {record && editingIndex === index ? (
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                initialValue: record[dataIndex],
                rules
              })(render ? render(record, index) : null)}
            </FormItem>
          ) : (
            restProps.children
          )}
        </td>
      ) : (
        <td>{restProps.children}</td>
      )
    }}
  </EditableContext.Consumer>
)
