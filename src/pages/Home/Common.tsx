import * as React from 'react'
import { Card } from 'antd'
import styled from 'styled-components'
import { WithFetchSimple } from '../../components/WithFetch'

export interface ISignItem {
  id: string
  meetingRoom: string
  phone: string
  state: number
  userId: number
  userName: string
  email: string
  signTime: string
  attendance: number
}

export interface IListResponse<T> {
  list: T[]
}

const Cover = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png);
  /* 16:9 */
  width: 100%;
  padding-top: 56.25%;
`
const Description: React.SFC<{ id: string; meetingId: string }> = ({
  id,
  meetingId
}) => (
  <WithFetchSimple
    url={`/api/meeting/${meetingId}/sign?dimension=room&dimension_id=${id}`}
  >
    {(data: IListResponse<ISignItem>) => (
      <div>
        应到人数: {data.list.length} 当前人数:{' '}
        {data.list.filter(item => item.attendance === 1).length}
      </div>
    )}
  </WithFetchSimple>
)

export const MeetingPlace = styled<
  React.SFC<{
    className?: string
    roomName: string
    id: string
    meetingId: string
  }>
>(({ className, roomName, id, meetingId }) => (
  <Card hoverable={true} cover={<Cover />} className={className}>
    <Card.Meta
      title={roomName}
      description={<Description meetingId={meetingId} id={id} />}
    />
  </Card>
))``
