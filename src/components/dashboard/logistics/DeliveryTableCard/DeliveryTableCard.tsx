import {
  Alert,
  CardProps,
  Table,
  TableProps,
  Spin,
  Tag,
  TagProps,
  Input,
} from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Card } from '../../../index.ts';
import { fetchEventLogs } from '../../../../service/event_logs.ts';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { EventData } from '../../../../types/event_logs.ts';

// export interface EventData {
//   id: number;
//   event_id: string;
//   utc_time: string;
//   process_guid: string;
//   process_id: number;
//   user: string;
//   creation_utc_time: string;
//   protocol: string;
//   initiated: boolean;
//   source_is_ipv6: boolean;
//   source_ip: string;
//   source_hostname: string;
//   source_port: number;
//   source_port_name: string;
//   destination_is_ipv6: boolean;
//   destination_ip: string;
//   destination_hostname: string;
//   destination_port: number;
//   destination_port_name: string;
//   is_passed_sigma_rules: boolean;
// }

type TabKeys = 'all' | 'in transit' | string;

const TAB_LIST = [
  { key: 'all', tab: 'All' },
  { key: 'in transit', tab: 'In Transit' },
];

const BASIC_COLUMNS: ColumnsType<EventData> = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) =>
      typeof text === 'string' ? text.split('-')[0] : text,
  },
  {
    title: 'Event id',
    dataIndex: 'event_id',
    key: 'event_id',
  },

  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: 'Protocol',
    dataIndex: 'protocol',
    key: 'protocol',
  },

  {
    title: 'Source IPv6',
    dataIndex: 'source_is_ipv6',
    key: 'source_is_ipv6',
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
    title: 'Source hostname',
    dataIndex: 'source_hostname',
    key: 'source_hostname',
  },
  {
    title: 'Source port',
    dataIndex: 'source_port',
    key: 'source_port',
  },
  // {
  //   title: 'Source Port Name',
  //   dataIndex: 'source_port_name',
  //   key: 'source_port_name',
  // },
  {
    title: 'Source ip',
    dataIndex: 'source_ip',
    key: 'source_ip',
  },
  {
    title: 'UTC time',
    dataIndex: 'utc_time',
    key: 'utc_time',
    render: (date: string) => new Date(date).toLocaleString(),
  },
  {
    title: 'Initiated',
    dataIndex: 'initiated',
    key: 'initiated',
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
    title: 'Destination hostname',
    dataIndex: 'destination_hostname',
    key: 'destination_hostname',
  },
  {
    title: 'Destination IPv6',
    dataIndex: 'destination_is_ipv6',
    key: 'destination_is_ipv6',
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
    title: 'Destination port',
    dataIndex: 'destination_port',
    key: 'destination_port',
  },
  // {
  //   title: 'Destination port name',
  //   dataIndex: 'destination_port_name',
  //   key: 'destination_port_name',
  // },
  // {
  //   title: 'Passed sigma rules',
  //   dataIndex: 'is_passed_sigma_rules',
  //   key: 'is_passed_sigma_rules',
  //   render: (val: boolean) => (val ? 'Yes' : 'No'),
  // },
  {
    title: 'Destination ip',
    dataIndex: 'destination_ip',
    key: 'destination_ip',
  },
  {
    title: 'Creation UTC time',
    dataIndex: 'creation_utc_time',
    key: 'creation_utc_time',
    render: (date: string) => new Date(date).toLocaleString(),
  },
];

type DeliveryTableProps = {
  data?: EventData[];
  loading?: boolean;
} & TableProps<EventData>;

const DeliveryTable = ({ data, loading, ...others }: DeliveryTableProps) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const onExpandRow = (expanded: boolean, record: EventData) => {
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
        pagination={{ pageSize: 10 }}
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
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <UpOutlined onClick={(e) => onExpand(record, e)} />
            ) : (
              <DownOutlined onClick={(e) => onExpand(record, e)} />
            ),
          expandedRowKeys,
          onExpand: onExpandRow,
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
  const [error, setError] = useState<ReactNode | null>(null);

  const onTabChange = (key: string) => {
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
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
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
          placeholder="search"
          style={{
            width: window.innerWidth <= 768 ? '100%' : '400px',
            marginLeft: window.innerWidth <= 768 ? 0 : '.5rem',
          }}
          size="middle"
        />
      }
      tabList={TAB_LIST}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
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
