import * as React from 'react'
import * as moment from 'moment'
import { Form, Radio, TimePicker, Button, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import request from '../../libs/request'

export interface IRoomConfig {
  signTime: string
  signWay: number
  collectHz: number
  collectOutInfo: number
}

interface IProps extends FormComponentProps {
  mid: string
  rid?: string
  defaultValues: IRoomConfig
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  afterSuccess?: () => void
}

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
    xs: { span: 24 }
  },
  wrapperCol: {
    sm: { span: 16 },
    xs: { span: 24 }
  }
}

const Setting: React.FunctionComponent<IProps> = ({
  form: { getFieldDecorator, validateFields },
  setModal,
  defaultValues,
  mid,
  rid,
  afterSuccess
}) => {
  const handleSubmit = () => {
    validateFields(async (err, values) => {
      if (err) {
        return
      }
      if (rid) {
        await request('/api/room/config', {
          data: {
            mid: +mid,
            rid: +rid,
            ...values
          },
          method: 'put',
          type: 'json'
        })
      } else {
        await request('/api/meeting', {
          data: {
            ...defaultValues,
            ...values
          },
          method: 'put',
          type: 'json'
        })
        if (afterSuccess) {
          afterSuccess()
        }
      }
      message.success('修改成功')
      setModal(false)
    })
  }
  return (
    <Form>
      <Form.Item label="签到时间" {...formItemLayout}>
        {getFieldDecorator('signTime', {
          initialValue: moment(defaultValues.signTime)
        })(<TimePicker />)}
      </Form.Item>
      <Form.Item label="签到方式" {...formItemLayout}>
        {getFieldDecorator('signWay', { initialValue: defaultValues.signWay })(
          <Radio.Group>
            <Radio value={0}>统一签到</Radio>
            <Radio value={1}>入场签到</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item label="采集频率" {...formItemLayout}>
        {getFieldDecorator('collectHz', {
          initialValue: defaultValues.collectHz
        })(
          <Radio.Group>
            <Radio value={300}>5分钟</Radio>
            <Radio value={60}>1分钟</Radio>
            <Radio value={30}>30秒</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item label="统计离场信息" {...formItemLayout}>
        {getFieldDecorator('collectOutInfo', {
          initialValue: defaultValues.collectOutInfo
        })(
          <Radio.Group>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={handleSubmit}>
          确定
        </Button>
        <Button onClick={() => setModal(false)} style={{ marginLeft: 12 }}>
          取消
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(Setting)
