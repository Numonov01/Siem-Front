import {
  Alert,
  Button,
  CardProps,
  Space,
  Table,
  Tag,
  TagProps,
  Modal,
  Form,
  Input,
  Upload,
  Switch,
  message,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Card } from '../../../index.ts';
import { ReactNode, useEffect, useState } from 'react';
import { UserRuleData } from '../../../../types/user_role.ts';
import {
  fetchRule,
  deleteRule,
  createRule,
} from '../../../../service/rules.ts';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { RcFile } from 'antd/es/upload';

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
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      await deleteRule(id);
      setLocalData((prev) => prev.filter((item) => item.id !== id));
      message.success('Rule deleted successfully');
    } catch (error) {
      console.error('Failed to delete rule:', error);
      message.error('Failed to delete rule');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm(null);
    }
  };

  const showDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this rule?',
      content: 'This action cannot be undone',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleDelete(id),
    });
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setUploading(true);

      const ruleData = new FormData();
      if (fileList.length > 0) {
        ruleData.append('file', fileList[0].originFileObj as RcFile);
      }
      ruleData.append('name', values.name);
      ruleData.append('is_active', values.is_active);

      const newRule = await createRule(ruleData);
      setLocalData((prev) => [...prev, newRule]);
      message.success('Rule created successfully');
      setCreateModalVisible(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error('Failed to create rule:', error);
      message.error('Failed to create rule');
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must be smaller than 5MB!');
      return false;
    }
    return true;
  };

  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const columns: ColumnsType<UserRuleData> = [
    {
      title: 'File',
      dataIndex: 'file',
      key: 'file',
      render: (fileUrl: string) =>
        fileUrl ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
            Download File
          </a>
        ) : (
          <span>No file</span>
        ),
    },
    {
      title: 'Text area',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="text-capitalize">{text}</span>,
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
            onClick={() => showDeleteConfirm(record.id)}
            danger
            size="small"
            loading={deleteConfirm === record.id && deleteLoading}
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
          onClick={() => setCreateModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Create
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

      {/* Create Rule Modal */}
      <Modal
        title="Create New Rule"
        open={createModalVisible}
        onOk={handleCreate}
        confirmLoading={uploading}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        okText="Create"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="file"
            label="File"
            rules={[{ required: true, message: 'Please upload a file' }]}
          >
            <Upload
              beforeUpload={beforeUpload}
              onChange={handleFileChange}
              fileList={fileList}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter rule description..." />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};
