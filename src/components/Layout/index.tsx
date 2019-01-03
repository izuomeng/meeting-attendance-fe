import { Layout, Menu, Icon } from 'antd'
import * as React from 'react'
import styled from 'styled-components'
import { Link, withRouter } from 'react-router-dom'
import HeaderImage from '../../images/header.png'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const StyledHeader = styled(Header)`
  background-color: #3cafcc !important;
  background-image: url(${HeaderImage});
  background-repeat: no-repeat;
  background-size: contain;
  background-origin: content-box;
  padding: 12px;
`

class AppLayout extends React.Component<any> {
  render() {
    const { pathname } = this.props.location
    const path2Key = {
      '/': 'ongoing',
      '/finished': 'finished'
    }
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <StyledHeader />
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={[path2Key[pathname]]}
              defaultOpenKeys={['meeting-attendance']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu
                key="meeting-attendance"
                title={
                  <span>
                    <Icon type="user" />
                    会议考勤
                  </span>
                }
              >
                <Menu.Item key="ongoing">
                  <Link to="/">进行中</Link>
                </Menu.Item>
                <Menu.Item key="finished">
                  <Link to="/finished">已完成</Link>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content
              style={{
                background: '#fff',
                margin: 0,
                minHeight: 280,
                padding: 24
              }}
            >
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(AppLayout)
