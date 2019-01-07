import * as React from 'react'
import produce from 'immer'
import XTable, { IRefs } from '../../components/XTable'
import { Switch, Spin } from 'antd'
import request from '../../libs/request'

interface IProps {
  rid: string
}

interface ICamera {
  id: number
  inUse: number
  type: string
  info: { name: string; location: string }
}

const table = { current: {} as IRefs }

const CameraManage: React.FunctionComponent<IProps> = props => {
  const [loading, setLoading] = React.useState(false)
  const handleSwitchInUse = async (value: number, record: ICamera) => {
    setLoading(true)
    try {
      await request('/api/equipment', {
        data: produce(record, irecord => {
          irecord.inUse = value
        }),
        method: 'put',
        type: 'json'
      })
      table.current.fetchData()
    } finally {
      setLoading(false)
    }
  }
  const columns = [
    { dataIndex: 'info.name', title: '名称' },
    { dataIndex: 'info.location', title: '位置' },
    { dataIndex: 'id', title: 'ID' },
    {
      dataIndex: 'inUse',
      title: '启用',
      render(cell: number, record: ICamera) {
        return (
          <Switch
            checked={!!cell}
            onChange={value => handleSwitchInUse(+value, record)}
          />
        )
      }
    }
  ]
  return (
    <Spin spinning={loading}>
      <XTable
        columns={columns}
        url={`/api/room/${props.rid}/equipment?type=camera`}
        refer={r => (table.current = r)}
      />
    </Spin>
  )
}

export default CameraManage
