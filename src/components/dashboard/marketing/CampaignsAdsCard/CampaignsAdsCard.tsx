import {
  Alert,
  Button,
  CardProps,
  Popover,
  Table,
  TableColumnsType,
} from 'antd';
import { Card } from '../../../index.ts';
import { QuestionOutlined } from '@ant-design/icons';
import { ReactNode, useEffect, useState } from 'react';
import * as _ from 'lodash';
import { fetchEventLogs } from '../../../../service/event_logs.ts';
import {
  EventData,
  NetworkEventResponse,
} from '../../../../types/event_logs.ts';

const PARENT_TABLE_COLUMNS: TableColumnsType<{
  id: string;
  ad_source: string;
  events: EventData[];
}> = [
  {
    title: 'ID Count',
    key: 'id',
    render: (_text, record) => record.events.length,
  },
  {
    title: 'User Count',
    key: 'user',
    render: (_text, record) => record.events.length,
  },
  {
    title: 'Event ID Count',
    key: 'event_id',
    render: (_text, record) => record.events.length,
  },
  {
    title: 'Time Count',
    key: 'utc_time',
    render: (_text, record) => record.events.length,
  },
  {
    title: 'Process GUID Count',
    key: 'process_guid',
    render: (_text, record) => record.events.length,
  },
  {
    title: 'Process ID Count',
    key: 'process_id',
    render: (_text, record) => record.events.length,
  },
  {
    title: 'Creation Time Count',
    key: 'creation_utc_time',
    render: (_text, record) => record.events.length,
  },
  {
    title: 'Protocol Count',
    key: 'protocol',
    render: (_text, record) => record.events.length,
  },
  {
    title: 'Initiated Count',
    key: 'initiated',
    render: (_text, record) => record.events.length,
  },
  {
    title: 'Source IPv6 Count',
    key: 'source_is_ipv6',
    render: (_text, record) => record.events.length,
  },
];

const CHILD_TABLE_COLUMNS: TableColumnsType<EventData> = [
  {
    title: 'Source ip',
    dataIndex: 'source_ip',
    key: 'source_ip',
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
  {
    title: 'Source port name',
    dataIndex: 'source_port_name',
    key: 'source_port_name',
  },
  {
    title: 'Destination is ipv6',
    dataIndex: 'destination_is_ipv6',
    key: 'destination_is_ipv6',
  },
  {
    title: 'Destination ip',
    dataIndex: 'destination_ip',
    key: 'destination_ip',
  },
  {
    title: 'Destination hostname',
    dataIndex: 'destination_hostname',
    key: 'destination_hostname',
  },
  {
    title: 'Destination port',
    dataIndex: 'destination_port',
    key: 'destination_port',
  },
  {
    title: 'Destination port name',
    dataIndex: 'destination_port_name',
    key: 'destination_port_name',
  },
  {
    title: 'Passed sigma rules',
    dataIndex: 'is_passed_sigma_rules',
    key: 'is_passed_sigma_rules',
  },
];

type ExpandedProps = { data: EventData[] };

const ExpandedRowRender = ({ data }: ExpandedProps) => {
  return (
    <Table
      columns={CHILD_TABLE_COLUMNS}
      dataSource={data}
      rowKey={(record) => record.id}
      pagination={{
        pageSize: 5,
        position: ['bottomRight'],
      }}
    />
  );
};

type Props = {
  loading?: boolean;
  error?: ReactNode;
} & CardProps;

export const CampaignsAdsCard = ({ error, ...others }: Props) => {
  const [eventData, setEventData] = useState<NetworkEventResponse[]>([]);
  const [groupedData, setGroupedData] = useState<
    { id: string; ad_source: string; events: EventData[] }[]
  >([]);

  useEffect(() => {
    fetchEventLogs()
      .then((data) => {
        console.log('Fetched data:', data);
        setEventData(data);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  useEffect(() => {
    const grouped = _.chain(eventData)
      .groupBy('ad_source')
      .map((items: EventData[], source: string) => ({
        id: source,
        ad_source: source,
        events: items,
      }))
      .value();

    setGroupedData(grouped);
  }, [eventData]);

  return error ? (
    <Alert
      message="Error"
      description={error.toString()}
      type="error"
      showIcon
    />
  ) : (
    <Card
      title="Campaign performance by source"
      extra={
        <Popover content="Marketing data by several ads resources">
          <Button icon={<QuestionOutlined />} type="text" />
        </Popover>
      }
      {...others}
    >
      <Table
        dataSource={groupedData}
        columns={PARENT_TABLE_COLUMNS}
        rowKey={(record) => record.id}
        expandable={{
          expandedRowRender: (record) => (
            <ExpandedRowRender data={record.events} />
          ),
        }}
        className="overflow-scroll"
      />
    </Card>
  );
};
