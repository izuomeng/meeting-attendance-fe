import * as React from 'react'
import * as moment from 'moment'
import styled from 'styled-components'
import XTable, { IColumn } from '../../components/XTable'
import { IUSerEntity, IMeeting } from '../../libs/interfaces'
import Filter, { IFormValues } from './Filter'
import RoomTable from './RoomTable'

const StyledFilter = styled(Filter)`
  margin-bottom: 12px !important;
`

const initialState = {
  date: '',
  title: ''
}

type State = Readonly<typeof initialState>

class FinishedMeeting extends React.Component<object, State> {
  readonly state = initialState

  columns: IColumn[] = [
    { dataIndex: 'title', title: '会议主题' },
    { dataIndex: 'createBy', title: '预约人' },
    {
      dataIndex: 'endTime',
      title: '会议日期',
      render(cell) {
        return moment(cell).format('YYYY-MM-DD')
      }
    },
    {
      dataIndex: 'startTime',
      title: '会议时间',
      render(cell, record: IMeeting) {
        return (
          <span>
            {moment(cell).format('hh:mm')}-
            {moment(record.endTime).format('hh:mm')}
          </span>
        )
      }
    },
    {
      dataIndex: 'signTime',
      title: '签到时间',
      render(cell) {
        return moment(cell).format('hh:mm')
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

  handleSubmit = async (values: IFormValues) => {
    this.setState({
      date: values.date && values.date.format('x'),
      title: values.title
    })
  }

  render() {
    const { date, title } = this.state
    return (
      <>
        <StyledFilter onSubmit={this.handleSubmit} />
        <XTable
          url="/api/meetings?type=finished"
          columns={this.columns}
          params={{ date, title }}
          expandedRowRender={RoomTable}
        />
      </>
    )
  }
}

export default FinishedMeeting
