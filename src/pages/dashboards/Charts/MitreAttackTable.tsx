import React from 'react';
import { Table, Card, Alert } from 'antd';
import { fetchBarListTable, LogItem } from '../../../service/default';
import { BarData } from '../../../types/default';

interface TransformedLogItem {
  id: string;
  EventId: number;
  Event: {
    ProcessId: string;
    LogonId: string;
    FileVersion: string;
    UtcTime: string;
  };
}

interface MitreAttackTableProps {
  technique: string;
  barData: BarData[];
}

const MitreAttackTable: React.FC<MitreAttackTableProps> = ({
  technique,
  barData,
}) => {
  const [tableData, setTableData] = React.useState<TransformedLogItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Event ID',
      dataIndex: 'EventId',
      key: 'EventId',
    },
    {
      title: 'Process ID',
      dataIndex: ['Event', 'ProcessId'],
      key: 'ProcessId',
    },
    {
      title: 'File Version',
      dataIndex: ['Event', 'FileVersion'],
      key: 'FileVersion',
    },
    {
      title: 'Logon Id',
      dataIndex: ['Event', 'LogonId'],
      key: 'LogonId',
    },
    {
      title: 'UTC Time',
      dataIndex: ['Event', 'UtcTime'],
      key: 'UtcTime',
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
        const items = barData.filter(
          (item) => item?.tag?.replace('attack.t', 'T') === technique
        );

        const transformLogItem = (log: LogItem): TransformedLogItem => ({
          id: log.id,
          EventId: log.EventId,
          Event: {
            ProcessId: log.Event?.ProcessId || 'N/A',
            FileVersion: log.Event?.FileVersion || 'N/A',
            LogonId: log.Event?.LogonId || 'N/A',
            UtcTime: log.Event?.UtcTime || 'N/A',
          },
        });

        const detailedData = await Promise.all(
          items.map(async (item) => {
            const logData = await fetchBarListTable(item.id);
            return logData.logs.map(transformLogItem);
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
  }, [technique, barData]);

  return (
    <Card
      title={`MITRE ATT&CK Details for ${technique}`}
      style={{ backgroundColor: '#fff' }}
    >
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

export default MitreAttackTable;
