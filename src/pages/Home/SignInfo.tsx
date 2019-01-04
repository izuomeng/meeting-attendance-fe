import * as React from 'react'
import styled from 'styled-components'
import XTable, { IRefs } from '../../components/XTable'
import { WithFetchSimple } from '../../components/WithFetch'
import request from '../../libs/request'
import { ISignItem } from './Common'

interface IStatistics {
  total: number
  confirm: number
  decline: number
  unknown: number
}

const stateAndStyle = [
  { text: '未响应', style: { color: '#e45555' } },
  { text: '请假', style: { color: '#3cafcc' } },
  { text: '参加', style: undefined }
]

const SplitLine = styled.div`
  background: #e6e6e6;
  width: 1px;
  height: 16px;
  display: inline-block;
`

const StatisticsContainer = styled.div`
  margin-bottom: 12px;
  ${SplitLine} {
    margin: 0 24px;
    vertical-align: middle;
  }
  & > div {
    display: inline-block;
  }
`

export const Statistic: React.SFC<{ id: string }> = ({ id }) => (
  <WithFetchSimple url={`/api/meeting/${id}/statistics`}>
    {(data: IStatistics) => (
      <StatisticsContainer>
        <div>总人数: {data.total}</div>
        <SplitLine />
        <div>参加人数: {data.confirm}</div>
        <SplitLine />
        <div>请假人数: {data.decline}</div>
        <SplitLine />
        <div>未响应人数: {data.unknown}</div>
      </StatisticsContainer>
    )}
  </WithFetchSimple>
)

const SignInfo: React.SFC<{ id: string }> = ({ id }) => {
  const self = { table: {} as IRefs }
  const columns = [
    { dataIndex: 'userName', title: '姓名' },
    { dataIndex: 'phone', title: '联系方式' },
    { dataIndex: 'email', title: '邮箱' },
    {
      dataIndex: 'state',
      title: '参会情况',
      render(text: 0 | 1 | 2) {
        return (
          <span style={stateAndStyle[text].style}>
            {stateAndStyle[text].text}
          </span>
        )
      }
    },
    { dataIndex: 'meetingRoom', title: '会场' },
    {
      dataIndex: 'action',
      title: '操作',
      render(_: any, record: ISignItem) {
        return (
          <a
            onClick={async () => {
              await request(`/api/meeting/${id}/sign`, {
                data: { uid: record.userId },
                method: 'delete'
              })
              self.table.fetchData()
            }}
            style={{ color: '#f5856d' }}
          >
            移除
          </a>
        )
      }
    }
  ]
  return (
    <>
      <Statistic id={id} />
      <XTable
        url={`/api/meeting/${id}/sign`}
        columns={columns}
        refer={r => (self.table = r)}
      />
    </>
  )
}

export default SignInfo
