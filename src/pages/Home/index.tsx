import * as React from 'react'
import { Select, Button, Modal } from 'antd'
import styled from 'styled-components'
// import WithFetch from '../../components/WithFetch'
import request from '../../libs/request'

interface IMeeting {
  title: string
  id: string
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
    margin-left: 12px;
  }
`

class OngoingMeeting extends React.Component<object, object> {
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
    const { data } = await request('/api/ongoing-meetings')
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
  ): (() => void) => () => {
    this.setState({ [name]: visible })
  }

  render() {
    const { currentMeeting, meetingList, signModalShow } = this.state
    const id = currentMeeting && currentMeeting.id
    return (
      <Container>
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
            <StyledButton>会议信息</StyledButton>
            <StyledButton onClick={this.toggleModal('signModalShow', true)}>
              参会情况
            </StyledButton>
          </div>
          <div>current: {JSON.stringify(currentMeeting)}</div>
          <Modal
            title="参会情况"
            visible={signModalShow}
            footer={null}
            onCancel={this.toggleModal('signModalShow')}
          >
            <div>参会信息</div>
          </Modal>
        </div>
        <div>sider</div>
      </Container>
    )
  }
}

export default OngoingMeeting
