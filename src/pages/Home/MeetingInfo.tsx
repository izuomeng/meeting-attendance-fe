import * as React from 'react'
import styled from 'styled-components'
import * as moment from 'moment'
import { WithFetchSimple } from '../../components/WithFetch'

export interface IMeetingInfo {
  id: string
  title: string
  startTime: string
  endTime: string
  type: number
  state: number
  createBy: string
  createTime: string
  rooms: Array<{ id: number; roomName: string }>
}

const LeftItem = styled.div`
  display: inline-block;
  width: 160px;
  padding: 12px 30px;
  background-color: #f4f4f4;
`
const RightItem = styled.div`
  display: inline-block;
  padding: 12px 30px;
  font-size: 12px;
`

const Item = styled<React.SFC<{ label: string; className?: string }>>(props => (
  <div className={props.className}>
    <LeftItem>{props.label}</LeftItem>
    <RightItem>{props.children}</RightItem>
  </div>
))``

function formatDate(timeStamp: string): string {
  return moment(timeStamp).format('YYYY-MM-DD')
}

function formatTime(timeStamp: string): string {
  return moment(timeStamp).format('hh:mm')
}

const MeetingInfo: React.SFC<{
  className?: string
  id: string
}> = props => (
  <WithFetchSimple url={`/api/meeting/${props.id}`} loading={true}>
    {(data: IMeetingInfo) => (
      <div className={props.className}>
        <Item label="创建人">{data.createBy}</Item>
        <Item label="审核人">{data.id}</Item>
        <Item label="创建时间">{formatDate(data.createTime)}</Item>
        <Item label="会议日期">{formatDate(data.startTime)}</Item>
        <Item label="会议时间">
          {formatTime(data.startTime)}-{formatTime(data.endTime)}
        </Item>
        <Item label="参会地点及人员">{data.id}</Item>
      </div>
    )}
  </WithFetchSimple>
)

const SMeetingInfo = styled(MeetingInfo)`
  ${Item} {
    border: 1px solid #e6e6e6;
    border-bottom: 0;
  }
  ${Item}:last-child {
    border-bottom: 1px solid #e6e6e6;
  }
`

export default SMeetingInfo
