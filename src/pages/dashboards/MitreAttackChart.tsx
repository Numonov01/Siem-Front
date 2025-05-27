import React from 'react';
import { Pie } from '@ant-design/charts';
import { BarData } from '../../types/default';

interface MitreAttackPieChartProps {
  data: BarData[];
}

const MitreAttackPieChart: React.FC<MitreAttackPieChartProps> = ({ data }) => {
  const processedData = data.map((item) => ({
    id: String(item.id),
    technique: item.tag.replace('attack.t', 'T'),
    value: 1,
  }));

  type GroupedDataItem = {
    id: string;
    technique: string;
    value: number;
  };

  const groupedData = processedData.reduce((acc: GroupedDataItem[], curr) => {
    const existing = acc.find((item) => item.technique === curr.technique);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as GroupedDataItem[]);

  const config = {
    data: groupedData,
    angleField: 'value',
    colorField: 'technique',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} ({percentage})',
    },
    legend: {
      position: 'right',
    },
    tooltip: {
      formatter: (datum: GroupedDataItem) => {
        return { name: datum.technique, value: datum.value };
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '16px',
        },
        content: 'MITRE\nATT&CK',
      },
    },
    color: (datum: GroupedDataItem) => {
      const num = parseInt(datum.technique.substring(1));
      const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#FFA07A',
        '#98D8C8',
        '#F06292',
        '#7986CB',
        '#9575CD',
        '#64B5F6',
        '#BA68C8',
        '#4DB6AC',
        '#FF8A65',
        '#A1887F',
        '#90A4AE',
        '#E57373',
        '#81C784',
      ];
      return colors[num % colors.length];
    },
  };

  return <Pie {...config} style={{ height: '400px' }} />;
};

export default MitreAttackPieChart;
