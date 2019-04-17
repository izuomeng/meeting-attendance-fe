import * as React from 'react'
import styled from 'styled-components'
import { Modal } from 'antd'
import XTable, { IColumn } from '../../components/XTable'
import { IUSerEntity, IMeetingEntity } from '../../libs/interfaces'
import { formatTime, formatDate } from '../../libs'
import Filter, { IFormValues } from '../../components/Filter'
import { Compare } from '../../components'
import RoomTable from './RoomTable'

const StyledFilter = styled(Filter)`
  margin-bottom: 12px !important;
`

const columns: IColumn[] = [
  { dataIndex: 'title', title: '会议主题' },
  { dataIndex: 'createBy', title: '预约人' },
  {
    dataIndex: 'endTime',
    title: '会议日期',
    render(_, record: IMeetingEntity) {
      return formatDate(record.startTime)
    }
  },
  {
    dataIndex: 'startTime',
    title: '会议时间',
    render(cell, record: IMeetingEntity) {
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

const signColumns: IColumn[] = [
  { dataIndex: 'userName', title: '姓名' },
  { dataIndex: 'signTime', title: '到场时间' },
  { dataIndex: 'signDesc', title: '到场结果' },
  {
    dataIndex: 'cameraName',
    title: '摄像头',
    render() {
      return '第二号'
    }
  },
  {
    dataIndex: 'image',
    title: '识别结果(人脸库vs抓拍图)',
    render(_: any, row: any) {
      return (
        <Compare url1={row.face} url2={row.image} />
      )
    }
  }
]

const FinishedMeeting: React.FunctionComponent = () => {
  const [params, setParams] = React.useState({ date: '', title: '' })
  const [modal, setModal] = React.useState(false)
  const [currentRoomId, setCurrentRoomId] = React.useState(0)
  const [currenMeetingId, setCurrentMeetingId] = React.useState(0)

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
            setMeeting={setCurrentMeetingId}
            setRoom={setCurrentRoomId}
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
        width="60%"
      >
        <XTable
          url={`/api/room/sign?mid=${currenMeetingId}&rid=${currentRoomId}`}
          columns={signColumns}
        />
      </Modal>
    </>
  )
}

export default FinishedMeeting
