import React from 'react';
import { Pie, PieConfig } from '@ant-design/charts';
import { DeviceRiskBar } from '../../../service/default';

interface PieDataItem {
  id: string;
  technique: string;
  value: number;
}

interface RiskPieChartProps {
  data: DeviceRiskBar[];
  onTechniqueClick: (technique: string) => void;
}

const RiskPieChart: React.FC<RiskPieChartProps> = ({
  data,
  onTechniqueClick,
}) => {
  const processedData: PieDataItem[] = data.map((item) => ({
    id: String(item.device_id),
    technique: item.device_name,
    value: item.total_risk,
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
      formatter: (datum) => {
        const technique =
          typeof datum.technique === 'string' ? datum.technique : 'Unknown';
        const value = typeof datum.value === 'number' ? datum.value : 0;

        return {
          name: technique,
          value,
        };
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
        content: 'Risk Distribution by Device',
      },
    },
    color: (datum) => {
      const technique =
        typeof datum.technique === 'string' ? datum.technique : '';
      let hash = 0;
      for (let i = 0; i < technique.length; i++) {
        hash = technique.charCodeAt(i) + ((hash << 5) - hash);
      }

      const colors = [
        '#FFA07A',
        '#98D8C8',
        '#45B7D1',
        '#F06292',
        '#9575CD',
        '#64B5F6',
        '#4DB6AC',
        '#FF8A65',
        '#A1887F',
        '#4FC3F7',
        '#90A4AE',
        '#E57373',
        '#DCE775',
        '#BA68C8',
        '#FF6B6B',
        '#4ECDC4',
        '#81C784',
        '#FFD54F',
        '#AED581',
        '#7986CB',
      ];

      return colors[Math.abs(hash) % colors.length];
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

export default RiskPieChart;
