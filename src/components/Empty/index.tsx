import * as React from 'react'
import { Icon } from 'antd'
import styled from 'styled-components'

const Empty: React.SFC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <Icon type="frown" /> 暂无数据
  </div>
)

const SEmpty = styled(Empty)`
  color: #e6e6e6;
  padding: 12px;
  text-align: center;
`

export default SEmpty
