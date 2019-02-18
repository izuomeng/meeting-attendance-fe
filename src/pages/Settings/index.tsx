import * as React from 'react'
import { Modal } from 'antd'
import Filter, { IFormValues } from '../../components/Filter'
import XTable, { IRefs } from '../../components/XTable'
import { IMeetingEntity } from '../../libs/interfaces'
import { formatTime, formatDate } from '../../libs'
import Setting from '../../components/MeetingConfig'

const table = { current: {} as IRefs }

const Settings: React.FunctionComponent = () => {
  const [editModal, setEditModal] = React.useState(false)
  const [currentMeeting, setCurrentMeeting] = React.useState(
    {} as IMeetingEntity
  )

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
        return cell ? `${cell / 60}分钟` : '-'
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
            <a style={{ marginLeft: 8 }}>修改会场</a>
          </>
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
    </>
  )
}

export default Settings
