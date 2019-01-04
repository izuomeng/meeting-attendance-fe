import * as React from 'react'
import styled from 'styled-components'
import { Modal } from 'antd'
import XTable, { IColumn } from '../../components/XTable'
import { IUSerEntity, IMeeting, IRoomEntity } from '../../libs/interfaces'
import { formatTime, formatDate } from '../../libs'
import Filter, { IFormValues } from '../../components/Filter'
import RoomTable from './RoomTable'

const StyledFilter = styled(Filter)`
  margin-bottom: 12px !important;
`

// TODO: 查看签到结果
const FinishedMeeting: React.FunctionComponent = () => {
  const [params, setParams] = React.useState({ date: '', title: '' })
  const [modal, setModal] = React.useState(false)
  const [currentRoom, setCurrentRoom] = React.useState({} as IRoomEntity)

  const columns: IColumn[] = [
    { dataIndex: 'title', title: '会议主题' },
    { dataIndex: 'createBy', title: '预约人' },
    {
      dataIndex: 'endTime',
      title: '会议日期',
      render(_, record: IMeeting) {
        return formatDate(record.startTime)
      }
    },
    {
      dataIndex: 'startTime',
      title: '会议时间',
      render(cell, record: IMeeting) {
        return (
          <span>
            {formatTime(cell)}-{formatTime(record.endTime)}
          </span>
        )
      }
    },
    {
      dataIndex: 'signTime',
      title: '签到时间',
      render(cell) {
        return formatTime(cell)
      }
    },
    {
      dataIndex: 'users',
      title: '参会人数',
      render(cell: IUSerEntity[]) {
        return cell.length
      }
    }
  ]

  const handleSubmit = (values: IFormValues) => {
    setParams({
      date: values.date && values.date.format('x'),
      title: values.title
    })
  }

  return (
    <>
      <StyledFilter onSubmit={handleSubmit} />
      <XTable
        url="/api/meetings?type=finished"
        columns={columns}
        params={params}
        expandedRowRender={(record: any) => (
          <RoomTable
            setRoom={setCurrentRoom}
            setModal={setModal}
            id={record.id}
          />
        )}
      />
      <Modal
        title="签到结果"
        visible={modal}
        footer={null}
        onCancel={() => setModal(false)}
      >
        <div>{JSON.stringify(currentRoom)}</div>
      </Modal>
    </>
  )
}

export default FinishedMeeting
