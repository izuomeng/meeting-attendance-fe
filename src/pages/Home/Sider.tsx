import * as React from 'react'
import styled from 'styled-components'
import * as moment from 'moment'
import { Tabs, Tree } from 'antd'
import { WithFetchSimple } from '../../components/WithFetch'

interface ISignItem {
  id: string
  meetingRoom: string
  phone: string
  state: number
  userName: string
  email: string
  signTime: string
}

const Container = styled.div`
  padding-left: 24px;
  border-left: 1px solid #e6e6e6;
  line-height: 2;
  & .ant-tree li .ant-tree-node-content-wrapper {
    height: auto;
  }
  & .ant-tree li span.ant-tree-switcher {
    width: auto;
  }
`

const Sider: React.SFC<{ id: string }> = ({ id }) => (
  <Container>
    <h2 style={{ textAlign: 'center' }}>到场情况</h2>
    <div>应到人数: 1280</div>
    <div>当前人数: 1887</div>
    <Tabs defaultActiveKey="1" style={{ width: '100%', marginTop: 12 }}>
      {['全部', '已到场', '未到场'].map((tab, index) => (
        <Tabs.TabPane key={String(index + 1)} tab={tab}>
          <SignList type={index + 1} id={id} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  </Container>
)

const SignList: React.SFC<{ type: number; id: string }> = ({ id, type }) => (
  <WithFetchSimple url={`/api/meeting/${id}/sign-info?type=${type}`}>
    {data => {
      const treeData = (data as { list: ISignItem[] }).list.reduce(
        (result, item) => {
          result[item.meetingRoom] = result[item.meetingRoom]
            ? result[item.meetingRoom].concat(item)
            : [item]
          return result
        },
        {}
      )
      return (
        <Tree defaultExpandAll={true}>
          {Object.keys(treeData).map((key: string) => (
            <Tree.TreeNode title={`${key}(${treeData[key].length})`} key={key}>
              {treeData[key].map((item: ISignItem) => (
                <Tree.TreeNode
                  title={<StyledItem data={item} />}
                  key={item.id}
                />
              ))}
            </Tree.TreeNode>
          ))}
        </Tree>
      )
    }}
  </WithFetchSimple>
)

const SignListItem: React.SFC<{ data: ISignItem; className?: string }> = ({
  data,
  className
}) => (
  <div className={className}>
    <div />
    <div>
      <span>{data.userName}</span>
      <br />
      <span>{moment(data.signTime).format('hh:mm:ss')}</span>
    </div>
    <div />
  </div>
)
const StyledItem = styled(SignListItem)`
  display: flex;
  & > div:first-child,
  & > div:last-child {
    min-width: 80px;
    width: 33%;
    padding-top: 33%;
    background-color: grey;
  }
  & > div:nth-child(2) {
    flex: 1;
    padding: 12px;
    text-align: center;
    vertical-align: middle;
  }
`

export default Sider
