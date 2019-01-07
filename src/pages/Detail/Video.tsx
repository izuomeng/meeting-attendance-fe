import * as React from 'react'

interface IProps {
  mid: string
  rid: string
}

const Video: React.FunctionComponent<IProps> = props => {
  return (
    <div style={{ color: '#fff' }}>
      {props.mid}: {props.rid}
    </div>
  )
}

export default Video
