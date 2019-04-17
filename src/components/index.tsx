import * as React from 'react'
import styled from 'styled-components'

const C: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <div />
    <div />
  </div>
)
export const Compare = styled(C)<{ url1: string; url2: string }>`
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
    background-image: ${props => (props.url1 ? `url(${props.url1})` : '')};
  }
  & > div:last-child {
    background-image: ${props => (props.url2 ? `url(${props.url2})` : '')};
  }
`
export const Line = styled.div`
  height: 1px;
  background-color: #e6e6e6;
`
