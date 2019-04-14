// tslint:disable:object-literal-sort-keys
import * as React from 'react'
import * as G2 from '@antv/g2'

export const PieChart: React.FC<{ data: object }> = () => {
  const div = React.createRef<HTMLDivElement>()

  React.useEffect(() => {
    const data = [
      {
        item: '拒绝',
        count: 40,
        percent: 0.4
      },
      {
        item: '参加',
        count: 21,
        percent: 0.21
      },
      {
        item: '迟到',
        count: 22,
        percent: 0.22
      },
      {
        item: '未知',
        count: 17,
        percent: 0.17
      }
    ]
    const chart = new G2.Chart({
      container: div.current as HTMLDivElement,
      height: 240,
      forceFit: true
    })
    chart.source(data, {
      percent: {
        formatter: (val: number) => val * 100 + '%'
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
  })

  return <div ref={div} />
}
