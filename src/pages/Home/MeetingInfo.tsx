import * as React from 'react'
import styled from 'styled-components'
import * as moment from 'moment'
import { WithFetchSimple } from '../../components/WithFetch'

interface IRoomUSer {
  id: number
  userName: string
  roomName: string
}

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
  users: IRoomUSer[]
}

const LeftItem = styled.div`
  width: 160px;
  padding: 12px 30px;
  background-color: #f4f4f4;
  position: relative;
`
const RightItem = styled.div`
  padding: 12px 30px;
  font-size: 12px;
  flex: 1;
`

const Item = styled<React.SFC<{ label: string; className?: string }>>(props => (
  <div className={props.className}>
    <LeftItem>
      <span>{props.label}</span>
    </LeftItem>
    <RightItem>{props.children}</RightItem>
  </div>
))`
  display: flex;
`

const MutilineItem = styled(Item)`
  ${RightItem} {
    line-height: 2;
  }
  ${LeftItem} > span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
`

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
    {(data: IMeetingInfo) => {
      const usersAndRooms = data.users.reduce((result, item) => {
        result[item.roomName] = result[item.roomName]
          ? result[item.roomName].concat(item)
          : [item]
        return result
      }, {})
      return (
        <div className={props.className}>
          <Item label="创建人">{data.createBy}</Item>
          <Item label="审核人">{data.id}</Item>
          <Item label="创建时间">{formatDate(data.createTime)}</Item>
          <Item label="会议日期">{formatDate(data.startTime)}</Item>
          <Item label="会议时间">
            {formatTime(data.startTime)}-{formatTime(data.endTime)}
          </Item>
          <MutilineItem label="参会地点及人员">
            {Object.keys(usersAndRooms).map(key => (
              <div key={key}>
                {key}:{' '}
                {usersAndRooms[key].map((roomUser: IRoomUSer) => (
                  <span style={{ marginLeft: 12 }} key={roomUser.id}>
                    {roomUser.userName}
                  </span>
                ))}
              </div>
            ))}
          </MutilineItem>
        </div>
      )
    }}
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
