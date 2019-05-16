import * as React from 'react'
import styled from 'styled-components'
import * as moment from 'moment'
import { Tabs, Tree } from 'antd'
import { WithFetchSimple } from '../../components/WithFetch'
import { useFetch } from '../../libs/hooks'
import Empty from '../../components/Empty'
import { ISignItem } from './I'
import { IListResponse } from '../../libs/interfaces'
import { DEFAULT_IMAGE } from '../../libs/const'

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

const Sider: React.FC<{ id: string }> = ({ id }) => {
  const { data } = useFetch<IListResponse<ISignItem>>(`/api/meeting/${id}/sign`)
  if (!data) {
    return <Container>empty</Container>
  }
  console.log(data)
  return (
    <Container>
      <h2 style={{ textAlign: 'center' }}>到场情况</h2>
      <div>应到人数: {data.list.length}</div>
      <div>
        当前人数: {data.list.filter(item => item.attendance === 1).length}
      </div>
      <Tabs defaultActiveKey="1" style={{ width: '100%', marginTop: 12 }}>
        {['全部', '已到场', '未到场'].map((tab, index) => (
          <Tabs.TabPane key={String(index + 1)} tab={tab}>
            <SignList type={index + 1} id={id} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Container>
  )
}

const SignList: React.FC<{ type: number; id: string }> = ({ id, type }) => (
  <WithFetchSimple url={`/api/meeting/${id}/sign?type=${type}`}>
    {(data: IListResponse<ISignItem>) => {
      if (!data.list || data.list.length === 0) {
        return <Empty />
      }
      const treeData = data.list.reduce((result, item) => {
        result[item.meetingRoom] = result[item.meetingRoom]
          ? result[item.meetingRoom].concat(item)
          : [item]
        return result
      }, {})
      return (
        <Tree defaultExpandAll={true}>
          {Object.keys(treeData).map((key: string) => (
            <Tree.TreeNode title={`${key}(${treeData[key].length})`} key={key}>
              {treeData[key].map((item: ISignItem) => (
                <Tree.TreeNode
                  title={<StyledItem data={item} />}
                  key={item.id + ''}
                />
              ))}
            </Tree.TreeNode>
          ))}
        </Tree>
      )
    }}
  </WithFetchSimple>
)

const SignListItem: React.FC<{ data: ISignItem; className?: string }> = ({
  data,
  className
}) => (
  <div className={className}>
    <div />
    <div>
      <span>{data.userName}</span>
      <br />
      {data.signTime ? (
        <span>{moment(data.signTime).format('HH:mm:ss')}</span>
      ) : (
        <span>00:00:00</span>
      )}
    </div>
    <div />
  </div>
)
const StyledItem = styled(SignListItem)<{ data: ISignItem }>`
  display: flex;
  padding-bottom: 8px;
  margin-bottom: 2px;
  border-bottom: 1px solid #e6e6e6;
  & > div:first-child,
  & > div:last-child {
    min-width: 80px;
    width: 33%;
    padding-top: 33%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
  }
  & > div:first-child {
    background-image: ${({ data }) =>
      data.face ? `url(${data.face})` : `url(${DEFAULT_IMAGE})`};
  }
  & > div:last-child {
    background-image: ${({ data }) =>
      data.image ? `url(${data.image})` : `url(${DEFAULT_IMAGE})`};
  }
  & > div:nth-child(2) {
    flex: 1;
    padding: 12px;
    text-align: center;
    vertical-align: middle;
  }
`

export default Sider
