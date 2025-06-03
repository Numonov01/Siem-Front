// src/pages/dashboard/default/Charts/MitreAttackPieChart.tsx
import React from 'react';
import { Pie, PieConfig } from '@ant-design/charts';
import { BarData } from '../../../types/default';

interface PieDataItem {
  id: string;
  technique: string;
  value: number;
}

interface MitreAttackPieChartProps {
  data: BarData[];
  onTechniqueClick: (technique: string) => void;
}

const MitreAttackPieChart: React.FC<MitreAttackPieChartProps> = ({
  data,
  onTechniqueClick,
}) => {
  const processedData: PieDataItem[] = data.map((item) => ({
    id: String(item.id),
    technique: item?.tag?.replace('attack.t', 'T') || 'Unknown',
    value: item.log_count,
  }));

  const groupedData = processedData.reduce((acc: PieDataItem[], curr) => {
    if (!curr.technique) return acc;

    const existing = acc.find((item) => item.technique === curr.technique);
    if (existing) {
      existing.value += curr.value;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  const pieConfig: PieConfig = {
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
      fields: ['technique', 'value'],
      formatter: (datum: PieDataItem) => ({
        name: datum.technique,
        value: datum.value,
      }),
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
    color: (datum: PieDataItem) => {
      const tech = datum.technique || '';
      const num = parseInt(tech.replace(/\D/g, '')) || 0;

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
        '#FFD54F',
        '#AED581',
        '#4FC3F7',
        '#DCE775',
      ];

      return colors[num % colors.length];
    },
    onReady: (plot) => {
      plot.on('element:click', (event: { data: { data: PieDataItem } }) => {
        const technique = event.data?.data?.technique;
        if (technique) {
          onTechniqueClick(technique);
        }
      });
    },
  };

  return <Pie {...pieConfig} style={{ height: '400px' }} />;
};

export default MitreAttackPieChart;
