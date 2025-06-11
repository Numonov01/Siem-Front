import {
  Button,
  Space,
  Table,
  TableProps,
  Tag,
  TagProps,
  Tooltip,
  Typography,
} from 'antd';
import { DeviceListData } from '../../../../types/device_list';
import { AppstoreOutlined, ClusterOutlined } from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';

const COLUMNS = (
  onAppListClick: (deviceId: number) => void,
  onTreeClick: (deviceId: number) => void
): ColumnType<DeviceListData>[] => [
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
    title: 'Last active',
    dataIndex: 'last_active',
    key: 'last_active',
    render: (date: string) => new Date(date).toLocaleString(),
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 250,
    fixed: 'right',
    render: (_: unknown, record: DeviceListData) => (
      <Space size="small">
        <Tooltip title="View applications">
          <Button
            size="small"
            icon={<AppstoreOutlined />}
            onClick={() => onAppListClick(record.pk)}
            style={{
              color: '#1890ff',
              borderColor: '#1890ff',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Apps
          </Button>
        </Tooltip>

        <Tooltip title="View process tree">
          <Button
            size="small"
            icon={<ClusterOutlined />}
            onClick={() => onTreeClick(record.pk)}
            style={{
              color: '#52c41a',
              borderColor: '#52c41a',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Tree
          </Button>
        </Tooltip>
      </Space>
    ),
  },
];

type Props = {
  data: DeviceListData[];
  loading?: boolean;
  onAppListClick: (deviceId: number) => void;
  onTreeClick: (deviceId: number) => void;
} & TableProps<DeviceListData>;

export const DeviceListTable = ({
  data,
  loading,
  onAppListClick,
  onTreeClick,
  ...others
}: Props) => {
  return (
    <Table
      dataSource={data}
      columns={COLUMNS(onAppListClick, onTreeClick)}
      className="overflow-scroll"
      loading={loading}
      rowKey="pk"
      {...others}
    />
  );
};
