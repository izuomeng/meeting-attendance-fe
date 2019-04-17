import * as React from 'react'
import XTable from '../../components/XTable'
import { formatTime } from '../../libs';

interface IProps {
  id: number
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  setRoom: React.Dispatch<React.SetStateAction<number>>
  setMeeting: React.Dispatch<React.SetStateAction<number>>
}

const RoomTable: React.FunctionComponent<IProps> = ({
  id,
  setModal,
  setRoom,
  setMeeting
}) => {
  const columns = [
    { dataIndex: 'roomName', title: '会场' },
    { dataIndex: 'roomLocation', title: '地点' },
    {
      dataIndex: 'signTime',
      title: '签到时间',
      render(cell: string) {
        return formatTime(cell)
      }
    },
    { dataIndex: 'signNum', title: '参与人数' },
    {
      dataIndex: 'action',
      title: '操作',
      render(_: any, record: any) {
        return (
          <a
            onClick={() => {
              setModal(true)
              setMeeting(id)
              setRoom(record.id)
            }}
          >
            签到结果
          </a>
        )
      }
    }
  ]
  return (
    <XTable
      url={`/api/rooms?mid=${id}`}
      columns={columns}
      style={{ margin: 12 }}
    />
  )
}

export default RoomTable
