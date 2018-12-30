import * as React from 'react'
import XTable from '../../components/XTable'
import { WithFetchSimple } from '../../components/WithFetch'

const columns = [
  { dataIndex: 'userName', title: '姓名' },
  { dataIndex: 'phone', title: '联系方式' },
  { dataIndex: 'email', title: '邮箱' },
  { dataIndex: 'state', title: '参会情况' },
  { dataIndex: 'meetingRoom', title: '会场' },
  {
    dataIndex: 'action',
    title: '操作',
    render() {
      return <a style={{ color: 'red' }}>删除</a>
    }
  }
]

export const Statistic: React.SFC<{ id: string }> = ({ id }) => (
  <WithFetchSimple url={`/api/${id}`}>
    {data => <div>text</div>}
  </WithFetchSimple>
)

const SignInfo: React.SFC<{ id: string }> = ({ id }) => (
  <>
    {/* <Statistic id={id} /> */}
    <XTable url={`/api/meeting/${id}/sign-info`} columns={columns} />
  </>
)

export default SignInfo
