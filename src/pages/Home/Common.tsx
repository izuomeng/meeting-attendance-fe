import * as React from 'react'
import { Card } from 'antd'
import styled from 'styled-components'
import { WithFetchSimple } from '../../components/WithFetch'
import { IListResponse } from '../../libs/interfaces'
import { withRouter, RouteComponentProps } from 'react-router'

import ShootImg from '../../images/shoot.png';

export interface ISignItem {
  id: number
  meetingRoom: string
  phone: string
  state: number
  userId: number
  userName: string
  email: string
  signTime: string
  attendance: number
}

const Cover = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${ShootImg});
  /* 16:9 */
  width: 100%;
  padding-top: 56.25%;
`
const Description: React.SFC<{ id: number; meetingId: string }> = ({
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

const MP: React.FunctionComponent<
  {
    className?: string
    roomName: string
    id: number
    meetingId: string
  } & RouteComponentProps
> = ({ className, roomName, id, meetingId, history }) => (
  <Card
    hoverable={true}
    cover={<Cover />}
    className={className}
    onClick={() => history.push(`/detail/${meetingId}/${id}`)}
  >
    <Card.Meta
      title={roomName}
      description={<Description meetingId={meetingId} id={id} />}
    />
  </Card>
)

export const MeetingPlace = styled<any>(withRouter(MP))``
