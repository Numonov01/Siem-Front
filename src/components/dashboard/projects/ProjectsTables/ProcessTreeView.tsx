import { Table, Typography, Tooltip, TagProps, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ProcessListData } from '../../../../types/process_list';
import { useState } from 'react';

interface Props {
  processes: ProcessListData[];
  loading: boolean;
}

const { Text } = Typography;

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

function buildTree(
  data: ProcessListData[]
): (ProcessListData & { children?: ProcessListData[]; level?: number })[] {
  const map = new Map<
    number,
    ProcessListData & { children?: ProcessListData[]; level?: number }
  >();
  const roots: (ProcessListData & {
    children?: ProcessListData[];
    level?: number;
  })[] = [];

  data.forEach((item) => {
    map.set(item.pid, { ...item, children: [], level: 0 });
  });

  data.forEach((item) => {
    const parent = map.get(item.ppid);
    const node = map.get(item.pid);
    if (parent && node) {
      node.level = (parent.level || 0) + 1;
      parent.children!.push(node);
    } else if (node) {
      roots.push(node);
    }
  });

  map.forEach((value) => {
    if (value.children && value.children.length === 0) {
      delete value.children;
    }
  });

  return roots;
}

const getRowStyle = (
  record: ProcessListData & { level?: number },
  expandedKeys: React.Key[]
) => {
  const isExpanded = expandedKeys.includes(record.pid);
  const level = record.level || 0;

  const levelColors = [
    '#e6f7ff', // level 0
    '#f6ffed', // level 1
    '#fff7e6', // level 2
    '#f9f0ff', // level 3
    '#fff0f6', // level 4
    '#f0f5ff', // level 5
  ];

  const baseColor = levelColors[Math.min(level, levelColors.length - 1)];

  if (isExpanded) {
    return {
      background: `${baseColor}`,
      borderLeft: `3px solid #1890ff`,
    };
  }

  return {
    background: `${baseColor}90`,
    borderLeft: level > 0 ? `3px solid #d9d9d9` : 'none',
  };
};

const columns: ColumnsType<ProcessListData> = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text: string, record: ProcessListData & { level?: number }) => (
      <Text strong style={{ paddingLeft: `${(record.level || 0) * 12}px` }}>
        {text}
      </Text>
    ),
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
  {
    title: 'Created',
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: 'Updated',
    dataIndex: 'updated_at',
    key: 'updated_at',
  },
  {
    title: 'Created time',
    dataIndex: 'create_time',
    key: 'create_time',
  },
  {
    title: 'Parent',
    dataIndex: 'parent',
    key: 'parent',
  },
];

export const ProcessTableTree = ({ processes, loading }: Props) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const treeData = buildTree(processes);

  const onExpand = (expanded: boolean, record: ProcessListData) => {
    const keys = expanded
      ? [...expandedKeys, record.pid]
      : expandedKeys.filter((key) => key !== record.pid);
    setExpandedKeys(keys);
  };

  return (
    <Table
      columns={columns}
      dataSource={treeData}
      rowKey="pid"
      loading={loading}
      pagination={false}
      expandable={{
        defaultExpandAllRows: true,
        onExpand: onExpand,
        expandedRowKeys: expandedKeys,
      }}
      scroll={{ x: 'max-content' }}
      style={{ background: '#fff', padding: 16, borderRadius: 8 }}
      onRow={(record) => ({
        style: getRowStyle(record, expandedKeys),
      })}
    />
  );
};
