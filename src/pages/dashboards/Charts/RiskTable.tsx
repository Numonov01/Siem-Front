import React from 'react';
import { Table, Card, Alert } from 'antd';
import {
  DeviceRiskBar,
  DeviceRiskList,
  fetchBarRiskListTable,
} from '../../../service/default';

interface TransformedRiskItem {
  id: number;
  risk_ball: number;
  threat_indicator: string;
  example: string;
  created_at: string;
}

interface RiskTableProps {
  technique: string;
  barRiskData: DeviceRiskBar[];
}

const RiskTable: React.FC<RiskTableProps> = ({ technique, barRiskData }) => {
  const [tableData, setTableData] = React.useState<TransformedRiskItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: 'Risk ball',
      dataIndex: 'risk_ball',
      key: 'risk_ball',
      render: (text: number) => (text !== undefined ? text : 'N/A'),
    },
    {
      title: 'Threat Indicator',
      dataIndex: 'threat_indicator',
      key: 'threat_indicator',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Example',
      dataIndex: 'example',
      key: 'example',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => {
        if (!date || date === 'N/A') return 'N/A';
        try {
          const originalDate = new Date(date);
          const adjustedDate = new Date(
            originalDate.getTime() + 5 * 60 * 60 * 1000
          );
          return adjustedDate.toLocaleString();
        } catch (e) {
          console.error('Error parsing date:', date);
          return 'Invalid Date';
        }
      },
    },
  ];

  React.useEffect(() => {
    const loadTableData = async () => {
      setLoading(true);
      setError(null);

      try {
        const items = barRiskData.filter(
          (item) => item?.device_name === technique
        );

        const transformRiskItem = (
          log: DeviceRiskList
        ): TransformedRiskItem => ({
          id: log.id,
          risk_ball: log.risk_ball,
          threat_indicator: log.threat_indicator,
          example: log.example,
          created_at: log.created_at || 'N/A',
        });

        const detailedData = await Promise.all(
          items.map(async (item) => {
            const logData = await fetchBarRiskListTable(item.device_id);
            if (Array.isArray(logData)) {
              return logData.map(transformRiskItem);
            } else if (logData) {
              return [transformRiskItem(logData)];
            } else {
              return [];
            }
          })
        );

        setTableData(detailedData.flat());
      } catch (err) {
        console.error('Error fetching table data:', err);
        setError('Failed to load detailed data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (technique) {
      loadTableData();
    }
  }, [technique, barRiskData]);

  return (
    <Card title={`Risk ${technique}`} style={{ backgroundColor: '#fff' }}>
      {error && <Alert message={error} type="error" />}
      <Table
        dataSource={tableData}
        columns={columns}
        loading={loading}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
      />
    </Card>
  );
};

export default RiskTable;
