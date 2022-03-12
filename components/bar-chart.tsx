import * as React from 'react';
import { Paper } from '@mui/material';
import {
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Chart,
  LineSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { ValueScale } from '@devexpress/dx-react-chart';

interface IDataItem {
  month: string;
  device: number;
  temp: number;
}

const chartData: IDataItem[] = [
  { month: 'Jan', device: 50, temp: 987 },
  { month: 'Feb', device: 100, temp: 3000 },
  { month: 'March', device: 30, temp: 1100 },
  { month: 'April', device: 107, temp: 7100 },
  { month: 'May', device: 95, temp: 4300 },
  { month: 'June', device: 150, temp: 7500 },
];

/**
 * @return {JSX.Element} LineBarChart
 */
export default function LineBarChart(): JSX.Element {
  return (
    <Paper>
      <Chart data={chartData}>
        <ValueScale name="device" />
        <ValueScale name="temp" />

        <ArgumentAxis />
        <ValueAxis
          scaleName="device"
          showGrid={false}
          showLine={true}
          showTicks={true}
        />
        <ValueAxis
          scaleName="temp"
          position="right"
          showGrid={false}
          showLine={true}
          showTicks={true}
        />

        <BarSeries
          name="Temperture"
          valueField="device"
          argumentField="month"
          scaleName="device"
        />
      </Chart>
    </Paper>
  );
}
