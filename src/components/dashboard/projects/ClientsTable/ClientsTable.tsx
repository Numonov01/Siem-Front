// ClientsTable.tsx
import { Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchDeviceAppsList } from '../../../../service/device_list';

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
];

type Application = {
  id: number;
  title: string;
};

type Props = {
  deviceId: number; // Add deviceId as a prop
} & TableProps<Application>;

export const ApplicationListTable = ({ deviceId, ...others }: Props) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        if (deviceId) {
          // Only fetch if deviceId is provided
          const device = await fetchDeviceAppsList(deviceId); // Use the prop
          console.log('Device apps data:', device);
          setApplications(device.applications || []);
        } else {
          setApplications([]); // Clear data if no deviceId
        }
      } catch (err) {
        console.error('Failed to fetch device data:', err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [deviceId]); // Add deviceId to dependency array

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
