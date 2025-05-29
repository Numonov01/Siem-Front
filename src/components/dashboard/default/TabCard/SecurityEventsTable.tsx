import { Table, Tag, TagProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ExpandedRow } from './ExpandedRow';
import { MismatchesItem } from '../../../../types/default';

// eslint-disable-next-line react-refresh/only-export-components
export const EVENT_COLUMNS: ColumnsType<MismatchesItem> = [
  {
    title: 'Rule id',
    dataIndex: ['rule', 'id'],
    key: 'id',
  },
  {
    title: 'Device Name',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: 'Title',
    dataIndex: ['rule', 'title'],
    key: 'title',
  },
  {
    title: 'Log id',
    dataIndex: 'log_id',
    key: 'log_id',
  },
  {
    title: 'Level',
    dataIndex: ['rule', 'level'],
    key: 'level',
    render: (_: string) => {
      let color: TagProps['color'];

      if (_ === 'low') {
        color = 'cyan';
      } else if (_ === 'medium') {
        color = 'geekblue';
      } else {
        color = 'magenta';
      }

      return (
        <Tag color={color} className="text-capitalize">
          {_}
        </Tag>
      );
    },
  },
];

export const SecurityEventsTable = ({
  data,
  loading,
}: {
  data: MismatchesItem[];
  loading: boolean;
}) => {
  return (
    <Table
      dataSource={data}
      columns={EVENT_COLUMNS}
      rowKey="id"
      expandable={{
        expandedRowRender: (record) => <ExpandedRow record={record} />,
      }}
      className="overflow-scroll"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      locale={{ emptyText: loading ? 'Loading...' : 'No data found' }}
    />
  );
};
