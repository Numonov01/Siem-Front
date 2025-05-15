// ClientsTable.tsx
import { Button, Space, Table, TableProps, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { fetchDeviceAppsList } from '../../../../service/device_list';
import { Device } from '../../../../types/device_list';

const { Text } = Typography;

const COLUMNS = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (record: Device) => (
      <Space size="small" direction="horizontal">
        <Button
          size="small"
          onClick={() => {
            console.log('Detailes clicked:', record.id);
          }}
        >
          <Text>View deailes</Text>
        </Button>
      </Space>
    ),
  },
];

type Application = {
  id: number;
  title: string;
};

type Props = {
  deviceId: number;
} & TableProps<Application>;

export const ApplicationListTable = ({ deviceId, ...others }: Props) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        if (deviceId) {
          const device = await fetchDeviceAppsList(deviceId);
          console.log('Device apps data:', device);
          setApplications(device.applications || []);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error('Failed to fetch device data:', err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [deviceId]);

  return (
    <Table
      dataSource={applications}
      columns={COLUMNS}
      rowKey="id"
      size="middle"
      className="overflow-scroll"
      loading={loading}
      {...others}
    />
  );
};
