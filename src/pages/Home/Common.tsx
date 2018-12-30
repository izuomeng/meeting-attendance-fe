import * as React from 'react'
import { Card } from 'antd'
import styled from 'styled-components'

const Cover = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png);
  /* 16:9 */
  width: 100%;
  padding-top: 56.25%;
`
export const MeetingPlace = styled<any>(({ className, roomName }: any) => (
  <Card hoverable={true} cover={<Cover />} className={className}>
    <Card.Meta
      title={roomName}
      description="应到人数：120           当前人数：118"
    />
  </Card>
))``
