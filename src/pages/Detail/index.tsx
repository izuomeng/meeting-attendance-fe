import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Carousel, Button, Modal } from 'antd'
import styled from 'styled-components'
import XTable from '../../components/XTable'
import Video from './Video'
import CameraManage from './Camera'
import Setting, { IRoomConfig } from './Setting'
import { useFetch } from '../../libs/hooks'
import { IMeetingEntity, IRoomEntity } from '../../libs/interfaces'
import { formatTime } from '../../libs'

const Container = styled.div`
  & .ant-carousel {
    width: 40%;
    display: inline-block;
  }
  & .ant-carousel .slick-slide {
    text-align: center;
    height: 240px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
  }
  & .ant-carousel .slick-slide h3 {
    color: #fff;
  }
`
const Info = styled.div`
  float: right;
  width: 55%;
  padding-left: 24px;

  & button:nth-of-type(2) {
    margin-left: 12px;
  }
`

const columns = [
  { dataIndex: 'userName', title: '姓名' },
  { dataIndex: 'signTime', title: '到场时间', render: formatTime },
  { dataIndex: 'signDesc', title: '到场结果' },
  { dataIndex: 'cameraName', title: '摄像头' },
  { dataIndex: 'image', title: '识别结果(人脸库vs抓拍图)' }
]

interface IParams {
  mid: string
  rid: string
}

const Detail: React.FunctionComponent<RouteComponentProps<IParams>> = ({
  match: { params }
}) => {
  const [meeting] = useFetch<IMeetingEntity>(`/api/meeting/${params.mid}`)
  const [room] = useFetch<IRoomEntity>(`/api/room/${params.rid}`)
  const [config] = useFetch<IRoomConfig>(
    `/api/room/config?mid=${params.mid}&rid=${params.rid}`
  )
  const [cameraModal, setCameraModal] = React.useState(false)
  const [configModal, setConfigModal] = React.useState(false)

  if (!meeting || !room) {
    return null
  }
  return (
    <Container>
      <Carousel>
        <Video {...params} />
        <Video {...params} />
      </Carousel>
      <Info>
        <p>会场名称: {room.roomName}</p>
        <p>会场地址: {room.location}</p>
        <p>
          会议时间: {formatTime(meeting.startTime)}-
          {formatTime(meeting.endTime)}
        </p>
        <Button onClick={() => setCameraModal(true)}>摄像头管理</Button>
        <Button onClick={() => setConfigModal(true)}>设置</Button>
      </Info>
      <XTable
        columns={columns}
        url={`/api/room/sign?mid=${params.mid}&rid=${params.rid}`}
        style={{ marginTop: 12 }}
      />
      <Modal
        width="50%"
        visible={cameraModal}
        footer={null}
        onCancel={() => setCameraModal(false)}
      >
        <CameraManage rid={params.rid} />
      </Modal>
      <Modal
        visible={configModal}
        footer={null}
        onCancel={() => setConfigModal(false)}
      >
        <Setting {...params} setModal={setConfigModal} defaultValues={config} />
      </Modal>
    </Container>
  )
}

export default withRouter(Detail)
