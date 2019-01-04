import * as React from 'react'
import Filter, { IFormValues } from '../../components/Filter'
import XTable, { IRefs } from '../../components/XTable'
import { IMeeting } from '../../libs/interfaces'
import { formatTime, formatDate } from '../../libs'

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
    render(_: any, record: IMeeting) {
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
  }
]

const table = { current: {} as IRefs }

const Settings: React.FunctionComponent = () => {
  const params = { date: '', title: '' }

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
    </>
  )
}

export default Settings
