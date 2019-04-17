import * as React from 'react'
import { Modal } from 'antd'
import Filter, { IFormValues } from '../../components/Filter'
import XTable, { IRefs } from '../../components/XTable'
import { IMeetingEntity } from '../../libs/interfaces'
import { formatTime, formatDate, toFixed } from '../../libs'
import Setting from '../../components/Setting'

const table = { current: {} as IRefs }

const Settings: React.FunctionComponent = () => {
  const [editModal, setEditModal] = React.useState(false)
  const [currentMeeting, setCurrentMeeting] = React.useState(
    {} as IMeetingEntity
  )
  const [roomListModal, setRoomListModal] = React.useState(false)

  const params = { date: '', title: '' }
  const columns = [
    { dataIndex: 'title', title: '会议主题' },
    {
      dataIndex: 'startTime',
      render: formatDate,
      title: '会议日期'
    },
    {
      dataIndex: 'endTime',
      title: '会议时间',
      render(_: any, record: IMeetingEntity) {
        return (
          <span>
            {formatTime(record.startTime)}-{formatTime(record.endTime)}
          </span>
        )
      }
    },
    {
      dataIndex: 'signWay',
      title: '签到方式',
      render(cell: number) {
        return ['统一签到', '入场签到'][cell]
      }
    },
    {
      dataIndex: 'collectHz',
      title: '采集频率',
      render(cell: number) {
        if (!cell) {
          return '-'
        }
        return cell >= 60 ? `${toFixed(cell / 60)}分钟` : `${cell}秒`
      }
    },
    {
      dataIndex: 'signTime',
      render: formatTime,
      title: '签到时间'
    },
    {
      dataIndex: 'collectOutInfo',
      title: '统计离场信息',
      render(cell: number) {
        return ['否', '是'][cell]
      }
    },
    {
      dataIndex: 'action',
      title: '操作',
      render(_: any, record: IMeetingEntity) {
        return (
          <>
            <a
              onClick={() => {
                setCurrentMeeting(record)
                setEditModal(true)
              }}
            >
              编辑
            </a>
            <a
              onClick={() => {
                setCurrentMeeting(record)
                setRoomListModal(true)
              }}
              style={{ marginLeft: 8 }}
            >
              修改会场
            </a>
          </>
        )
      }
    }
  ]
  const roomColumns = [
    { dataIndex: 'roomName', title: '会场' },
    { dataIndex: 'roomLocation', title: '地点' },
    {
      dataIndex: 'action',
      title: '操作',
      render(_: any, row: any) {
        return (
          <a href={`/detail/${currentMeeting.id}/${row.id}?setting=1`}>设置</a>
        )
      }
    }
  ]

  const handleFilter = (values: IFormValues) => {
    params.date = values.date && values.date.format('x')
    params.title = values.title
    table.current.fetchData()
  }

  return (
    <>
      <Filter onSubmit={handleFilter} style={{ marginBottom: 12 }} />
      <XTable
        url="/api/meetings?type=ongoing"
        columns={columns}
        refer={r => (table.current = r)}
        beforeFetch={() => ({
          date: params.date,
          title: params.title
        })}
      />
      <Modal
        visible={editModal}
        footer={null}
        onCancel={() => setEditModal(false)}
      >
        <Setting
          setModal={setEditModal}
          defaultValues={currentMeeting}
          mid={currentMeeting.id}
          afterSuccess={table.current.fetchData}
        />
      </Modal>
      <Modal
        visible={roomListModal}
        footer={null}
        onCancel={() => setRoomListModal(false)}
      >
        <XTable
          url={`/api/rooms?mid=${currentMeeting.id}`}
          columns={roomColumns}
        />
      </Modal>
    </>
  )
}

export default Settings
