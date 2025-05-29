import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from 'chart.js';
import { MismatchesLevelChart } from '../../../types/default';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

export const MismatchesLevelLineChart = ({
  data,
}: {
  data: MismatchesLevelChart;
}) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor:
        dataset.label === 'High'
          ? 'rgb(255, 99, 132)'
          : dataset.label === 'Medium'
            ? 'rgb(54, 162, 235)'
            : 'rgb(75, 192, 192)',
      backgroundColor:
        dataset.label === 'High'
          ? 'rgba(255, 99, 132, 0.5)'
          : dataset.label === 'Medium'
            ? 'rgba(54, 162, 235, 0.5)'
            : 'rgba(75, 192, 192, 0.5)',
      tension: 0.1,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
};
