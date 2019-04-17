// tslint:disable:object-literal-sort-keys
import * as React from 'react'
import * as G2 from '@antv/g2'
import { IResp } from './I'
import { toFixed } from '../../libs';

export const PieChart: React.FC<{ data: IResp }> = ({ data: info }) => {
  const div = React.createRef<HTMLDivElement>()

  React.useEffect(() => {
    const data = [
      {
        item: '拒绝',
        count: info.decline,
        percent: toFixed(info.decline / info.total * 100)
      },
      {
        item: '参加',
        count: info.confirm,
        percent: toFixed(info.confirm / info.total * 100)
      },
      {
        item: '未知',
        count: info.unknown,
        percent: toFixed(info.unknown / info.total * 100)
      }
    ]
    const chart = new G2.Chart({
      container: div.current as HTMLDivElement,
      height: 240,
      forceFit: true
    })
    chart.source(data, {
      percent: {
        formatter: (val: number) => val + '%'
      }
    })
    chart.coord('theta', {
      radius: 0.8
    })
    chart.tooltip({
      showTitle: false,
      itemTpl:
        '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    })
    chart
      .intervalStack()
      .position('percent')
      .color('item')
      .label('percent', {
        formatter: (val: string, item: any) => item.point.item + ': ' + val
      })
      .tooltip('item*percent', (item: any, percent: number) => ({
        name: item,
        value: percent * 100 + '%'
      }))
      .style({
        lineWidth: 1,
        stroke: '#fff'
      })
    chart.render()
  }, [])

  return <div ref={div} />
}
