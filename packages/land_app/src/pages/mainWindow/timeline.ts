import { Button } from 'antd';
import { useState } from 'react';
// import { Chart } from '@antv/g2';

const labelFormatter = (d: number) => d;
// const left = (d) => d.end > -1500 && d.start > -3000;

// chart.coordinate({ transform: [{ type: 'transpose' }] });

// .transform({ type: 'sortX', by: 'y' })
// .transform({ type: 'sortColor', by: 'y', reducer: 'min' })
// .axis('y', [
//   {
//     tickCount: 5,
//     labelFormatter,
//     grid: null,
//     title: null,
//     labelTextAlign: 'start',
//   },
//   {
//     position: 'top',
//     labelFormatter,
//     title: null,
//     labelTextAlign: 'start',
//   },
// ])
// .axis('x', false)
// .encode('x', 'civilization')
// .encode('y', ['start', 'end'])
// .encode('color', 'region')
// .scale('color', { palette: 'set2' });
// .label({
//   text: 'civilization',
//   position: (d) => (left(d) ? 'left' : 'right'),
//   style: {
//     textAlign: (d) => (left(d) ? 'end' : 'start'),
//     dx: (d) => (left(d) ? -5 : 5),
//     fontSize: 10,
//   },
// });

export const renderPl = (data: any[]): void => {
  // const chart = new Chart({
  //   container: 'container',
  //   width: 900,
  //   height: 1000,
  // });
  // chart.interval().data = data;
  // chart.render();
};
