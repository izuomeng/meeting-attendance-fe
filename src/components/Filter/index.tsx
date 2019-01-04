import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { Form, DatePicker, Input, Button } from 'antd'
import * as moment from 'moment'
import { CSSObject } from 'styled-components'

interface IProps extends FormComponentProps {
  onSubmit: (values: IFormValues) => void
  className?: string
  style?: CSSObject
}

export interface IFormValues {
  date: moment.Moment
  title: string
}

const Filter: React.SFC<IProps> = ({
  form: { getFieldDecorator, validateFields },
  onSubmit,
  className,
  style
}) => {
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    validateFields((err, values: IFormValues) => {
      if (err) {
        return
      }
      onSubmit(values)
    })
  }
  return (
    <Form
      layout="inline"
      onSubmit={handleSubmit}
      className={className}
      style={style}
    >
      <Form.Item label="会议日期">
        {getFieldDecorator('date')(<DatePicker placeholder="选择日期" />)}
      </Form.Item>
      <Form.Item label="会议标题">
        {getFieldDecorator('title')(<Input placeholder="输入会议标题" />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(Filter)
