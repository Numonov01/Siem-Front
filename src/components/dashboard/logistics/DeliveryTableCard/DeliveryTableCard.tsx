import {
  Alert,
  CardProps,
  Table,
  TableProps,
  Spin,
  Input,
  Tooltip,
} from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Card } from '../../../index.ts';
import { fetchEventLogs } from '../../../../service/event_logs.ts';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { EventData } from '../../../../types/event_logs.ts';

type TabKeys = 'all' | 'in transit' | string;

const TAB_LIST = [
  { key: 'all', tab: 'All' },
  { key: 'in transit', tab: 'In Transit' },
];

const formatName = (name: string) => {
  const shortened = name.length > 10 ? name.slice(0, 10) + '...' : name;
  return (
    <Tooltip title={name}>
      <span>{shortened}</span>
    </Tooltip>
  );
};

const formatImage = (image: string) => {
  const shortened = image.length > 15 ? image.slice(0, 15) + '...' : image;
  return (
    <Tooltip title={image}>
      <span>{shortened}</span>
    </Tooltip>
  );
};

const formatTargetFileName = (target_filename: string | null) => {
  if (!target_filename) return <span>-</span>;
  const shortened =
    target_filename.length > 15
      ? target_filename.slice(0, 15) + '...'
      : target_filename;
  return (
    <Tooltip title={target_filename}>
      <span>{shortened}</span>
    </Tooltip>
  );
};

const formatParentImage = (parent_image: string | null) => {
  if (!parent_image) return <span>-</span>;
  const shortened =
    parent_image.length > 15 ? parent_image.slice(0, 15) + '...' : parent_image;
  return (
    <Tooltip title={parent_image}>
      <span>{shortened}</span>
    </Tooltip>
  );
};

const formatCommandLine = (command_line: string | null) => {
  if (!command_line) return <span>-</span>;
  const shortened =
    command_line.length > 15 ? command_line.slice(0, 15) + '...' : command_line;
  return (
    <Tooltip title={command_line}>
      <span>{shortened}</span>
    </Tooltip>
  );
};

const formatSourceIp = (source_ip: string | null) => {
  if (!source_ip) return <span>-</span>;
  return <span>{source_ip}</span>;
};

const formatSourcePort = (source_port: string | null) => {
  if (!source_port) return <span>-</span>;
  return <span>{source_port}</span>;
};
const formatDestinationIp = (destination_ip: string | null) => {
  if (!destination_ip) return <span>-</span>;
  return <span>{destination_ip}</span>;
};
const formatDestinationPort = (destination_port: string | null) => {
  if (!destination_port) return <span>-</span>;
  return <span>{destination_port}</span>;
};

// const formatDestinationPort = (destination_port: string | null) => {
//   if (!destination_port) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
//   return <span>{destination_port}</span>;
// };

const BASIC_COLUMNS: ColumnsType<EventData> = [
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    render: formatName,
  },
  {
    title: 'Event id',
    dataIndex: 'event_id',
    key: 'event_id',
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    render: formatImage,
  },
  {
    title: 'Target filename',
    dataIndex: 'target_filename',
    key: 'target_filename',
    render: formatTargetFileName,
  },
  {
    title: 'Command line',
    dataIndex: 'command_line',
    key: 'command_line',
    render: formatCommandLine,
  },
  {
    title: 'Parent image',
    dataIndex: 'parent_image',
    key: 'parent_image',
    render: formatParentImage,
  },
  {
    title: 'Source ip',
    dataIndex: 'source_ip',
    key: 'source_ip',
    render: formatSourceIp,
  },

  {
    title: 'Source port',
    dataIndex: 'source_port',
    key: 'source_port',
    render: formatSourcePort,
  },
  {
    title: 'UTC time',
    dataIndex: 'utc_time',
    key: 'utc_time',
    render: (date: string) => new Date(date).toLocaleString(),
  },
];

const EXPANDED_COLUMNS: ColumnsType<EventData> = [
  {
    title: 'Process id',
    dataIndex: 'process_id',
    key: 'process_id',
  },
  {
    title: 'Process GUID',
    dataIndex: 'process_guid',
    key: 'process_guid',
  },
  {
    title: 'Parent process guid',
    dataIndex: 'parent_process_guid',
    key: 'parent_process_guid',
  },
  {
    title: 'Parent process id',
    dataIndex: 'parent_process_id',
    key: 'parent_process_id',
  },
  {
    title: 'Destination ip',
    dataIndex: 'destination_ip',
    key: 'destination_ip',
    render: formatDestinationIp,
  },
  {
    title: 'Destination port',
    dataIndex: 'destination_port',
    key: 'destination_port',
    render: formatDestinationPort,
  },
  {
    title: 'Integrity level',
    dataIndex: 'integrity_level',
    key: 'integrity_level',
  },
  {
    title: 'Host id',
    dataIndex: 'host_id',
    key: 'host_id',
  },
  {
    title: 'Ingest time',
    dataIndex: 'ingest_time',
    key: 'ingest_time',
    render: (date: string) => new Date(date).toLocaleString(),
  },
];

type DeliveryTableProps = {
  data?: EventData[];
  loading?: boolean;
} & TableProps<EventData>;

const DeliveryTable = ({ data, loading, ...others }: DeliveryTableProps) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const handleExpand = (expanded: boolean, record: EventData) => {
    if (!record?.id) return;
    setExpandedRowKeys((prev) =>
      expanded ? [...prev, record.id] : prev.filter((key) => key !== record.id)
    );
  };

  return (
    <Spin spinning={loading}>
      <Table
        rowKey="id"
        dataSource={data || []}
        columns={BASIC_COLUMNS}
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={EXPANDED_COLUMNS}
              dataSource={[record]}
              pagination={false}
              showHeader={true}
              bordered
            />
          ),
          expandIcon: ({ expanded, onExpand, record }) => {
            if (!record) return <span>-</span>;
            const Icon = expanded ? UpOutlined : DownOutlined;
            return <Icon onClick={(e) => onExpand(record, e)} />;
          },
          expandedRowKeys,
          onExpand: handleExpand,
        }}
        {...others}
      />
    </Spin>
  );
};

type Props = CardProps;

export const DeliveryTableCard = ({ ...others }: Props) => {
  const [activeTabKey, setActiveTabKey] = useState<TabKeys>('all');
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReactNode>(null);

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchEventLogs();
        setEventData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredData =
    activeTabKey === 'in transit' ? eventData.filter((d) => d.user) : eventData;

  return (
    <Card
      title="Log lists"
      extra={
        <Input.Search
          placeholder="Search logs..."
          style={{
            width: window.innerWidth <= 768 ? '100%' : '400px',
            marginLeft: window.innerWidth <= 768 ? 0 : '.5rem',
          }}
          size="middle"
        />
      }
      tabList={TAB_LIST}
      activeTabKey={activeTabKey}
      onTabChange={handleTabChange}
      {...others}
    >
      {error ? (
        <Alert
          message="Error"
          description={error.toString()}
          type="error"
          showIcon
        />
      ) : (
        <DeliveryTable data={filteredData} loading={loading} />
      )}
    </Card>
  );
};
