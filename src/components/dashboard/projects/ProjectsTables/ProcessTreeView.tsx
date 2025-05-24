import { Table, Typography, Tooltip, TagProps, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ProcessListData } from '../../../../types/process_list';

interface Props {
  processes: ProcessListData[];
  loading: boolean;
}

const { Text } = Typography;

// Cmdline'ni formatlash: 10ta belgidan so'ng '...' va hoverda to‘liq ko‘rsatish
const formatCmdline = (cmdline: string[]) => {
  if (!cmdline || cmdline.length === 0) return '-';
  const fullText = cmdline.join(' ');
  const shortened =
    fullText.length > 20 ? fullText.slice(0, 20) + '...' : fullText;

  return (
    <Tooltip title={fullText}>
      <span>{shortened}</span>
    </Tooltip>
  );
};
const formatExe = (exe: string) => {
  const shortened = exe.length > 20 ? exe.slice(0, 20) + '...' : exe;

  return (
    <Tooltip title={exe}>
      <span>{shortened}</span>
    </Tooltip>
  );
};

const formatCwd = (cwd: string | null) => {
  if (!cwd) return '-';

  const shortened = cwd.length > 20 ? cwd.slice(0, 20) + '...' : cwd;

  return (
    <Tooltip title={cwd}>
      <span>{shortened}</span>
    </Tooltip>
  );
};

// Tree structure yaratish (pid/ppid asosida)
function buildTree(data: ProcessListData[]): ProcessListData[] {
  const map = new Map<
    number,
    ProcessListData & { children?: ProcessListData[] }
  >();
  const roots: (ProcessListData & { children?: ProcessListData[] })[] = [];

  data.forEach((item) => {
    // Child bo'lmagan processlar uchun children ni undefined qilib qo'yamiz
    map.set(item.pid, { ...item, children: [] });
  });

  data.forEach((item) => {
    const parent = map.get(item.ppid);
    const node = map.get(item.pid);
    if (parent && node) {
      parent.children!.push(node);
    } else if (node) {
      roots.push(node);
    }
  });

  // Child bo'lmagan processlarda children ni undefined qilamiz
  map.forEach((value) => {
    if (value.children && value.children.length === 0) {
      delete value.children;
    }
  });

  return roots;
}

// Table columnlari
const columns: ColumnsType<ProcessListData> = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: 'Process',
    dataIndex: 'exe',
    key: 'exe',
    render: formatExe,
  },
  {
    title: 'PPID',
    dataIndex: 'ppid',
    key: 'ppid',
  },
  {
    title: 'PID',
    dataIndex: 'pid',
    key: 'pid',
  },
  {
    title: 'Process type',
    dataIndex: 'process_type',
    key: 'process_type',
    render: (process_type: 'installed' | string) => {
      const status = process_type ? 'installed' : 'not installed';
      const color: TagProps['color'] = process_type ? 'green' : 'red';

      return (
        <Tag color={color} className="text-capitalize">
          {status}
        </Tag>
      );
    },
  },
  {
    title: 'CWD',
    dataIndex: 'cwd',
    key: 'cwd',
    render: formatCwd,
  },
  {
    title: 'Cmdline',
    dataIndex: 'cmdline',
    key: 'cmdline',
    render: formatCmdline,
  },
  //   {
  //     title: 'Created',
  //     dataIndex: 'created_at',
  //     key: 'created_at',
  //   },
  //   {
  //     title: 'Updated',
  //     dataIndex: 'updated_at',
  //     key: 'updated_at',
  //   },
  //   {
  //     title: 'Created time',
  //     dataIndex: 'create_time',
  //     key: 'create_time',
  //   },
  //   {
  //     title: 'Parent',
  //     dataIndex: 'parent',
  //     key: 'parent',
  //   },
];

// Table componenti
export const ProcessTableTree = ({ processes, loading }: Props) => {
  const treeData = buildTree(processes);

  return (
    <Table
      columns={columns}
      dataSource={treeData}
      rowKey="pid"
      loading={loading}
      pagination={{}}
      expandable={{ defaultExpandAllRows: true }}
      scroll={{ x: 'max-content' }}
      style={{ background: '#fff', padding: 16, borderRadius: 8 }}
    />
  );
};
