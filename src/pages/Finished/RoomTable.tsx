import * as React from 'react'
import * as moment from 'moment'
import XTable from '../../components/XTable'

interface IProps {
  id: number
}

const RoomTable: React.SFC<IProps> = ({ id }) => {
  const columns = [
    { dataIndex: 'roomName', title: '会场' },
    { dataIndex: 'roomLocation', title: '地点' },
    {
      dataIndex: 'signTime',
      title: '签到时间',
      render(cell: string) {
        return moment(cell).format('hh:mm')
      }
    },
    { dataIndex: 'signNum', title: '参与人数' }
  ]
  return (
    <XTable
      url={`/api/meeting/${id}/rooms`}
      columns={columns}
      style={{ margin: 12 }}
    />
  )
}

export default RoomTable
