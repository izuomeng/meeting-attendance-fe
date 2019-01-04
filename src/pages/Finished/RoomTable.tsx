import * as React from 'react'
import * as moment from 'moment'
import XTable from '../../components/XTable'
import { IRoomEntity } from '../../libs/interfaces'

interface IProps {
  id: number
  setModal: React.Dispatch<React.SetStateAction<boolean>>
  setRoom: React.Dispatch<React.SetStateAction<IRoomEntity>>
}

const RoomTable: React.FunctionComponent<IProps> = ({
  id,
  setModal,
  setRoom
}) => {
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
    { dataIndex: 'signNum', title: '参与人数' },
    {
      dataIndex: 'action',
      title: '操作',
      render(_: any, record: IRoomEntity) {
        return (
          <a
            onClick={() => {
              setModal(true)
              setRoom(record)
            }}
          >
            签到结果
          </a>
        )
      }
    }
  ]
  return (
    <>
      <XTable
        url={`/api/meeting/${id}/rooms`}
        columns={columns}
        style={{ margin: 12 }}
      />
    </>
  )
}

export default RoomTable
