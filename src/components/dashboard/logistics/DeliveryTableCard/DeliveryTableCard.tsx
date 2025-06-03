import {
  Alert,
  CardProps,
  Table,
  TableProps,
  Spin,
  Input,
  TagProps,
  Tag,
  Tooltip,
} from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Card } from '../../../index.ts';
import { fetchEventLogs } from '../../../../service/event_logs.ts';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  NetworkEvent,
  NetworkEventResponse,
} from '../../../../types/event_logs.ts';

type TabKeys = 'all' | 'in transit' | string;

const TAB_LIST = [
  { key: 'all', tab: 'All' },
  { key: 'in transit', tab: 'In Transit' },
];

const BASIC_COLUMNS: ColumnsType<NetworkEvent> = [
  {
    title: 'Event id',
    dataIndex: 'EventId',
    key: 'EventId',
  },
  // {
  //   title: 'RuleName',
  //   dataIndex: ['Event', 'RuleName'],
  //   key: 'RuleName',
  // },
  {
    title: 'User',
    dataIndex: ['Event', 'User'],
    key: 'User',
  },
  {
    title: 'Time stamp',
    dataIndex: ['Event', 'EventHeader', 'TimeStamp'],
    key: 'TimeStamp',
  },
  // {
  //   title: 'Parent user',
  //   dataIndex: ['Event', 'ParentUser'],
  //   key: 'ParentUser',
  // },
  {
    title: 'Thread id',
    dataIndex: ['Event', 'EventHeader', 'ThreadId'],
    key: 'ThreadId',
  },
  {
    title: 'Process id',
    dataIndex: ['Event', 'EventHeader', 'ProcessId'],
    key: 'ProcessId',
  },

  {
    title: 'Kernel time',
    dataIndex: ['Event', 'EventHeader', 'KernelTime'],
    key: 'KernelTime',
  },
  {
    title: 'Integrity level',
    dataIndex: ['Event', 'IntegrityLevel'],
    key: 'IntegrityLevel',
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
    title: 'UTC time',
    dataIndex: ['Event', 'UtcTime'],
    key: 'UtcTime',
    render: (date: string) => {
      const originalDate = new Date(date);
      const adjustedDate = new Date(
        originalDate.getTime() + 5 * 60 * 60 * 1000
      );
      return adjustedDate.toLocaleString();
    },
  },
];

const EXPANDED_COLUMNS: ColumnsType<NetworkEvent> = [
  // {
  //   title: 'Task name',
  //   dataIndex: ['Event', 'Task Name'],
  //   key: 'Task Name',
  // },
  {
    title: 'Image',
    dataIndex: ['Event', 'Image'],
    key: 'Image',
    render: (Image: string) => (
      <Tooltip title={Image}>
        {Image.length > 30 ? `${Image.substring(0, 30)}...` : Image}
      </Tooltip>
    ),
  },
  {
    title: 'File version',
    dataIndex: ['Event', 'FileVersion'],
    key: 'FileVersion',
  },
  {
    title: 'Original fileName',
    dataIndex: ['Event', 'OriginalFileName'],
    key: 'OriginalFileName',
  },
  {
    title: 'Command line',
    dataIndex: ['Event', 'CommandLine'],
    key: 'CommandLine',
    // render: (CommandLine: string) => (
    //   <Tooltip title={CommandLine}>
    //     {CommandLine.length > 30
    //       ? `${CommandLine.substring(0, 30)}...`
    //       : CommandLine}
    //   </Tooltip>
    // ),
  },
  {
    title: 'Logon id',
    dataIndex: ['Event', 'LogonId'],
    key: 'LogonId',
  },
  {
    title: 'User time',
    dataIndex: ['Event', 'EventHeader', 'UserTime'],
    key: 'UserTime',
    render: (date: string) => {
      const originalDate = new Date(date);
      const adjustedDate = new Date(
        originalDate.getTime() + 5 * 60 * 60 * 1000
      );
      return adjustedDate.toLocaleString();
    },
  },
];

type DeliveryTableProps = {
  data?: NetworkEvent[];
  loading?: boolean;
} & TableProps<NetworkEvent>;

const DeliveryTable = ({ data, loading, ...others }: DeliveryTableProps) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const handleExpand = (expanded: boolean, record: NetworkEvent) => {
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
        scroll={{ x: true }}
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
  const [eventData, setEventData] = useState<NetworkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ReactNode>(null);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchEventLogs(page, pageSize);
        const eventResponse: NetworkEventResponse = Array.isArray(response)
          ? response[0]
          : response;
        setEventData(eventResponse.results);
        setTotal(eventResponse.count);
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, pageSize]);

  const filteredData =
    activeTabKey === 'in transit'
      ? eventData.filter((d) => d.EventId)
      : eventData;

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
      onTabChange={(key) => setActiveTabKey(key)}
      {...others}
    >
      {error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <DeliveryTable
          data={filteredData}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (newPage, newSize) => {
              setPage(newPage);
              setPageSize(newSize || 10);
            },
          }}
        />
      )}
    </Card>
  );
};
