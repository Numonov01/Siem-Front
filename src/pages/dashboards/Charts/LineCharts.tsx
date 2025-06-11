import { Line } from '@ant-design/charts';
import { useEffect, useState } from 'react';
import { fetchMismatchesChart } from '../../../service/default';
import { MismatchesLevelChart } from '../../../types/default';

const MismatchesLineChart = () => {
  const [chartData, setChartData] = useState<
    { dateTime: string; level: string; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMismatchesChart();
        if (Array.isArray(response)) {
          response.forEach((item) => transformData(item));
        } else {
          transformData(response);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformData = (apiData: MismatchesLevelChart) => {
    const transformed = [];

    for (let i = 0; i < apiData.labels.length; i++) {
      const dateTime = apiData.labels[i];

      for (const dataset of apiData.datasets) {
        transformed.push({
          dateTime,
          level: dataset.label,
          value: dataset.data[i],
        });
      }
    }

    setChartData(transformed);
  };

  const config = {
    data: chartData,
    loading,
    title: {
      visible: true,
      text: 'Mismatches Level Chart',
    },
    xField: 'dateTime',
    yField: 'value',
    seriesField: 'level',
    xAxis: {
      label: {
        formatter: (text: string) => {
          return text.length > 10 ? text.substring(11) : text;
        },
      },
    },
    legend: {
      position: 'top' as const,
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#82c541', '#fcd407', '#ed1d2f'],
  };

  return <Line {...config} />;
};

export default MismatchesLineChart;
