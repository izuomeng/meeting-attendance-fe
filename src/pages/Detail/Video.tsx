import * as React from 'react'

interface IProps {
  mid: string
  rid: string
}

const Video: React.FunctionComponent<IProps> = props => {
  return (
    <div>
      <iframe
        src="http://imgcache.qq.com/open/qcloud/video/vcplayer/demo/tcplayer.html?m3u8=http%3A//www.i-zuomeng.com/live/cyf.m3u8"
        width="100%"
        height="320"
        frameBorder="false"
      />
    </div>
  )
}

export default Video
