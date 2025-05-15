import { Alert, CardProps, Table, Tag, TagProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Card } from '../../../index.ts';
import { ReactNode, useEffect, useState } from 'react';
import { UserRoleData } from '../../../../types/user_role.ts';
import { fetchRole } from '../../../../service/role.ts';

const ROLE_COLUMNS: ColumnsType<UserRoleData> = [
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
];

type Props = {
  data?: UserRoleData[];
  loading?: boolean;
  error?: ReactNode;
} & CardProps;

export const RulesCard = ({
  data: propData,
  loading,
  error,
  ...others
}: Props) => {
  const [localData, setLocalData] = useState<UserRoleData[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<ReactNode>(null);

  useEffect(() => {
    if (!propData) {
      setLocalLoading(true);
      fetchRole()
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
    <Card title="Roles" {...others}>
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
          columns={ROLE_COLUMNS}
          loading={displayLoading}
          className="overflow-scroll"
          rowKey="id"
        />
      )}
    </Card>
  );
};
