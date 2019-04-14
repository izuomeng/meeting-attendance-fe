import * as React from 'react'
import { Card } from 'antd'
import styled from 'styled-components';
import { useFetch } from '../../libs/hooks'
import Loading from '../../components/Loading'
import { PieChart } from './Chart';

interface IResp {
  id: number
  title: string
  confirm: number
  decline: number
  unknown: number
  total: number
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  & .ant-card {
    width: 32%;
    margin-left: calc((100% - 96%) / 2);
    margin-bottom: 24px;
  }
  & .ant-card:nth-child(3n + 1) {
    margin-left: 0;
  }
  & .ant-card-body {
    padding: 8px;
  }
`

const Statistics: React.FunctionComponent = () => {
  const { data } = useFetch<IResp[]>('/api/meetings/statistics')

  if (!data) {
    return <Loading />
  }
  return (
    <Container>
      {data.map(item => (
        <Card hoverable={true} key={item.id} title={item.title}>
          <PieChart data={[]} />
        </Card>
      ))}
    </Container>
  )
}

export default Statistics
