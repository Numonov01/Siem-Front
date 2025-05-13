import {
  Button,
  Space,
  Table,
  TableProps,
  Tag,
  TagProps,
  Typography,
} from 'antd';
import { DeviceListData } from '../../../../types/device_list';

const { Text } = Typography;

const COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string) => (
      <Typography.Paragraph
        ellipsis={{ rows: 1 }}
        className="text-capitalize"
        style={{ marginBottom: 0 }}
      >
        {name.substring(0, 20)}
      </Typography.Paragraph>
    ),
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: 'OS name',
    dataIndex: 'os_name',
    key: 'os_name',
  },
  {
    title: 'Last active',
    dataIndex: 'last_active',
    key: 'last_active',
    render: (date: string) => new Date(date).toLocaleString(),
  },
  {
    title: 'Ip address',
    dataIndex: 'ip_address',
    key: 'ip_address',
  },
  {
    title: 'MAC address',
    dataIndex: 'mac_address',
    key: 'mac_address',
  },
  {
    title: 'Status',
    dataIndex: 'is_active',
    key: 'is_active',
    render: (isActive: boolean) => {
      const status = isActive ? 'active' : 'inactive';
      const color: TagProps['color'] = isActive ? 'green' : 'red';

      return (
        <Tag color={color} className="text-capitalize">
          {status}
        </Tag>
      );
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    render: () => (
      <Space size="small" direction="horizontal">
        <Button
          size="small"
          onClick={() => {
            console.log('App List clicked:');
          }}
        >
          <Text>App List</Text>
        </Button>
        <Button
          size="small"
          onClick={() => {
            console.log('Device Logs clicked:');
          }}
        >
          <Text>Device Logs</Text>
        </Button>
      </Space>
    ),
  },
];

type Props = {
  data: DeviceListData[];
  loading?: boolean;
} & TableProps<DeviceListData>;

export const DeviceListTable = ({ data, loading, ...others }: Props) => {
  return (
    <Table
      dataSource={data}
      columns={COLUMNS}
      className="overflow-scroll"
      loading={loading}
      rowKey="pk"
      {...others}
    />
  );
};
