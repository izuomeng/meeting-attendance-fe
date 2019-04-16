import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Carousel, Button, Modal } from 'antd'
import styled from 'styled-components'
import XTable, { IRefs } from '../../components/XTable'
import Video from './Video'
import CameraManage from './Camera'
import Setting, { IRoomConfig } from '../../components/MeetingConfig'
import { useFetch } from '../../libs/hooks'
import { IMeetingEntity, IRoomEntity } from '../../libs/interfaces'
import { formatTime } from '../../libs'

const DEFAULT_IMAGE = 'http://p3.pstatp.com/origin/1e0730001764139a48f85'

const Container = styled.div`
  & .ant-carousel {
    width: 40%;
    display: inline-block;
  }
  & .ant-carousel .slick-slide {
    height: 320px;
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

  & button:nth-of-type(n + 2) {
    margin-left: 12px;
  }
`

const Compare = styled.div<{ faceHubUrl: string; takenUrl: string }>`
  display: flex;
  width: 160px;
  justify-content: space-between;
  & > div {
    width: 48%;
    height: 70px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  & > div:first-child {
    background-image: ${props =>
      props.faceHubUrl ? `url(${props.faceHubUrl})` : ''};
  }
  & > div:last-child {
    background-image: ${props =>
      props.takenUrl ? `url(${props.takenUrl})` : ''};
  }
`

const columns = [
  { dataIndex: 'userName', title: '姓名' },
  { dataIndex: 'signTime', title: '到场时间', render: formatTime },
  { dataIndex: 'signDesc', title: '到场结果' },
  {
    dataIndex: 'cameraName',
    title: '摄像头',
    render() {
      return '摄像头1号'
    }
  },
  {
    dataIndex: 'image',
    title: '识别结果(人脸库vs抓拍图)',
    render(_: any, row: any) {
      return (
        <Compare faceHubUrl={row.face} takenUrl={row.image || DEFAULT_IMAGE}>
          <div />
          <div />
        </Compare>
      )
    }
  }
]

interface IParams {
  mid: string
  rid: string
}

const ws = new WebSocket('ws://localhost:8080')
const refs: { table: null | IRefs } = { table: null }

const Detail: React.FunctionComponent<RouteComponentProps<IParams>> = ({
  match: { params }
}) => {
  const { data: meeting } = useFetch<IMeetingEntity>(
    `/api/meeting/${params.mid}`
  )
  const { data: room } = useFetch<IRoomEntity>(`/api/room/${params.rid}`)
  const { data: config } = useFetch<IRoomConfig>(
    `/api/room/config?mid=${params.mid}&rid=${params.rid}`
  )
  const [cameraModal, setCameraModal] = React.useState(false)
  const [configModal, setConfigModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  // 告知服务端开始进行人脸比对
  const passport = JSON.stringify({ type: 1, mid: params.mid, rid: params.rid })

  ws.onopen = () => {
    console.log('Connection open ...')
    ws.send(passport)
  }

  ws.onmessage = evt => {
    const message = JSON.parse(evt.data)
    // 1表示重新请求数据
    if (message.type === 1 && refs.table) {
      refs.table.fetchData()
      setLoading(false)
    }
  }

  ws.onclose = () => {
    console.log('Connection closed.')
  }

  if (!meeting || !room || !config) {
    return null
  }
  return (
    <Container>
      <Carousel>
        <Video {...params} />
        <Video {...params} />
      </Carousel>
      <Info>
        <p>会议标题: {meeting.title}</p>
        <p>会场名称: {room.roomName}</p>
        <p>会场地址: {room.location}</p>
        <p>
          会议时间: {formatTime(meeting.startTime)}-
          {formatTime(meeting.endTime)}
        </p>
        <p>签到时间: {formatTime(config.signTime)}</p>
        <Button onClick={() => setCameraModal(true)}>摄像头管理</Button>
        <Button onClick={() => setConfigModal(true)}>设置</Button>
        <Button
          loading={loading}
          type="danger"
          onClick={() => {
            ws.send(passport)
            setLoading(true)
          }}
        >
          Send
        </Button>
      </Info>
      <XTable
        columns={columns}
        url={`/api/room/sign?mid=${params.mid}&rid=${params.rid}`}
        style={{ marginTop: 12 }}
        refer={r => (refs.table = r)}
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
