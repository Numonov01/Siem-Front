import { Alert, Button, CardProps, Space, Table, Tag, TagProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Card } from '../../../index.ts';
import { ReactNode, useEffect, useState } from 'react';
import { UserRuleData } from '../../../../types/user_role.ts';
import { fetchRule, deleteRule } from '../../../../service/rules.ts';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

type Props = {
  data?: UserRuleData[];
  loading?: boolean;
  error?: ReactNode;
} & CardProps;

export const RulesCard = ({
  data: propData,
  loading,
  error,
  ...others
}: Props) => {
  const [localData, setLocalData] = useState<UserRuleData[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<ReactNode>(null);

  // Delete handler
  const handleDelete = async (id: number) => {
    try {
      await deleteRule(id);
      setLocalData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  // Columns including delete action
  const columns: ColumnsType<UserRuleData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: string) => <span className="text-capitalize">{_}</span>,
    },
    {
      title: 'File',
      dataIndex: 'file',
      key: 'file',
      render: (fileUrl: string) => (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
          Download File
        </a>
      ),
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
      render: (record: UserRuleData) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              console.log('Edit clicked');
            }}
            size="small"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
            size="small"
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (!propData) {
      setLocalLoading(true);
      fetchRule()
        .then((data) => {
          setLocalData(data);
          setLocalLoading(false);
        })
        .catch((error) => {
          setLocalError(error.toString());
          setLocalLoading(false);
        });
    }
  }, [propData]);

  const displayData = propData || localData;
  const displayLoading = loading || localLoading;
  const displayError = error || localError;

  return (
    <Card
      title="Rules"
      extra={
        <Button
          type="primary"
          onClick={() => {
            console.log('Create clicked');
          }}
        >
          <PlusOutlined /> Create
        </Button>
      }
      {...others}
    >
      {displayError ? (
        <Alert
          message="Error"
          description={displayError.toString()}
          type="error"
          showIcon
        />
      ) : (
        <Table
          dataSource={displayData}
          columns={columns}
          loading={displayLoading}
          className="overflow-scroll"
          rowKey="id"
        />
      )}
    </Card>
  );
};
