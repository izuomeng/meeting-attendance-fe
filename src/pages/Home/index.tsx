import * as React from 'react'
import { Select, Button, Modal } from 'antd'
import styled from 'styled-components'
import request from '../../libs/request'
import SignInfo from './SignInfo'
import { MeetingPlace } from './Common'
import Loading from '../../components/Loading'
import Sider from './Sider'
import MeetingInfo from './MeetingInfo'
import Empty from '../../components/Empty'

interface IMeeting {
  title: string
  id: string
  rooms: Array<{ id: string; roomName: string }>
}
interface IState {
  currentMeeting: undefined | IMeeting
  meetingList: IMeeting[]
  signModalShow: boolean
  infoModalShow: boolean
}

const StyledButton = styled<any>(Button).attrs({ type: 'primary' })`
  margin-left: 12px;
  float: right;
`
const Container = styled.div`
  display: flex;
  & > div:first-child {
    flex: 1;
  }
  & > div:last-child {
    width: 320px;
    margin-left: 24px;
  }
`
const MeetingRoomContainer = styled.div`
  padding: 24px 0;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  ${MeetingPlace} {
    justify-content: space-between;
    width: 30%;
    margin-bottom: 12px;
  }
`

class OngoingMeeting extends React.Component<object, IState> {
  readonly state: IState = {
    currentMeeting: undefined,
    infoModalShow: false,
    meetingList: [],
    signModalShow: false
  }

  componentDidMount() {
    this.fetchMeetingList()
  }

  async fetchMeetingList() {
    const { data } = await request('/api/meetings')
    this.setState({ meetingList: data, currentMeeting: data[0] })
  }

  handleChange = (value: string): void => {
    this.setState({
      currentMeeting: this.state.meetingList.find(m => m.id === value)
    })
  }

  toggleModal = (
    name: 'signModalShow' | 'infoModalShow',
    visible: boolean = false
  ) => () => {
    // there is a bug using this.setState({ [name]: visible })
    name === 'signModalShow'
      ? this.setState({ signModalShow: visible })
      : this.setState({ infoModalShow: visible })
  }

  render() {
    const {
      currentMeeting,
      meetingList,
      signModalShow,
      infoModalShow
    } = this.state

    if (!currentMeeting) {
      return <Loading />
    }

    const id = currentMeeting.id

    return (
      <Container>
        {/* 与sider并列 */}
        <div>
          <div>
            <Select
              value={id}
              onChange={this.handleChange}
              style={{ width: 200 }}
            >
              {meetingList.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>
            <StyledButton onClick={this.toggleModal('infoModalShow', true)}>
              会议信息
            </StyledButton>
            <StyledButton onClick={this.toggleModal('signModalShow', true)}>
              参会情况
            </StyledButton>
          </div>

          {currentMeeting.rooms.length > 0 ? (
            <MeetingRoomContainer>
              {currentMeeting.rooms.map(item => (
                <MeetingPlace {...item} key={item.id} meetingId={id} />
              ))}
            </MeetingRoomContainer>
          ) : (
            <Empty />
          )}

          <Modal
            title="参会情况"
            visible={signModalShow}
            footer={null}
            width="60%"
            onCancel={this.toggleModal('signModalShow')}
          >
            {id && <SignInfo id={id} />}
          </Modal>
          <Modal
            title="会议信息"
            visible={infoModalShow}
            footer={null}
            onCancel={this.toggleModal('infoModalShow')}
          >
            <MeetingInfo id={id} />
          </Modal>
        </div>

        <Sider id={id} />
      </Container>
    )
  }
}

export default OngoingMeeting
