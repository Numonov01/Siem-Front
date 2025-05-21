// import { Tree, Typography, Space } from 'antd';
// import type { DataNode } from 'antd/es/tree';
// import { ProcessListData } from '../../../../types/process_list';

// interface Props {
//   processes: ProcessListData[];
// }

// const { Text } = Typography;

// const formatCmdline = (cmdline: string[]) => cmdline.join(' ');

// function getProcessDetails(proc: ProcessListData): React.ReactNode {
//   return (
//     <Space direction="vertical" size={0}>
//       <Text strong>{proc.exe}</Text>

//       <Text>
//         <Text type="secondary">PID:</Text>
//         {proc.title}
//       </Text>
//       <Text>
//         <Text type="secondary">PID:</Text> {proc.pid}
//       </Text>
//       <Text>
//         <Text type="secondary">PPID:</Text> {proc.ppid}
//       </Text>
//       <Text>
//         <Text type="secondary">Process type:</Text> {proc.process_type}
//       </Text>
//       <Text>
//         <Text type="secondary">CWD:</Text> {proc.cwd || "Noma'lum"}
//       </Text>
//       <Text>
//         <Text type="secondary">Cmdline:</Text> {formatCmdline(proc.cmdline)}
//       </Text>
//       <Text>
//         <Text type="secondary">Created:</Text> {proc.created_at}
//       </Text>
//       <Text>
//         <Text type="secondary">Updated:</Text> {proc.updated_at}
//       </Text>
//     </Space>
//   );
// }

// // Processlar daraxtini qurish
// function buildTree(processes: ProcessListData[]): DataNode[] {
//   const map = new Map<number, DataNode>();

//   processes.forEach((proc) => {
//     map.set(proc.pid, {
//       title: getProcessDetails(proc),
//       key: proc.pid,
//       children: [],
//     });
//   });

//   const tree: DataNode[] = [];

//   processes.forEach((proc) => {
//     const node = map.get(proc.pid);
//     const parent = map.get(proc.ppid);

//     if (parent && node) {
//       parent.children?.push(node);
//     } else if (node) {
//       tree.push(node);
//     }
//   });

//   return tree;
// }

// export const ProcessTree = ({ processes }: Props) => {
//   const treeData = buildTree(processes);

//   return (
//     <Tree
//       treeData={treeData}
//       defaultExpandAll
//       style={{ background: '#fff', padding: 16, borderRadius: 8 }}
//     />
//   );
// };

import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ProcessListData } from '../../../../types/process_list';

interface Props {
  processes: ProcessListData[];
}

const { Text } = Typography;

const formatCmdline = (cmdline: string[]) => cmdline.join(' ');

// Tree structure yaratish (pid/ppid asosida)
function buildTree(data: ProcessListData[]): ProcessListData[] {
  const map = new Map<
    number,
    ProcessListData & { children?: ProcessListData[] }
  >();
  const roots: (ProcessListData & { children?: ProcessListData[] })[] = [];

  data.forEach((item) => {
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

  return roots;
}

//  Table columnlarini yozamiz
const columns: ColumnsType<ProcessListData> = [
  {
    title: 'Process',
    dataIndex: 'exe',
    key: 'exe',
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'PID',
    dataIndex: 'pid',
    key: 'pid',
  },
  {
    title: 'PPID',
    dataIndex: 'ppid',
    key: 'ppid',
  },
  {
    title: 'Type',
    dataIndex: 'process_type',
    key: 'process_type',
  },
  {
    title: 'CWD',
    dataIndex: 'cwd',
    key: 'cwd',
    render: (cwd: string | null) => cwd || "Noma'lum",
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
];

// Table componenti
export const ProcessTableTree = ({ processes }: Props) => {
  const treeData = buildTree(processes);

  return (
    <Table
      columns={columns}
      dataSource={treeData}
      rowKey="pid"
      pagination={false}
      expandable={{ defaultExpandAllRows: true }}
      scroll={{ x: 'max-content' }}
      style={{ background: '#fff', padding: 16, borderRadius: 8 }}
    />
  );
};
