import { Tag, Tooltip, Typography } from 'antd';
import { ProcessListData } from '../../../../types/process_list';
import './ProcessTreeView.css';

const { Text } = Typography;

type ProcessTreeNode = ProcessListData & {
  children: ProcessTreeNode[];
};

interface ProcessTreeBoxProps {
  processes: ProcessListData[];
}

const buildTree = (data: ProcessListData[]): ProcessTreeNode[] => {
  const treeMap: { [pid: number]: ProcessTreeNode } = {};
  const rootNodes: ProcessTreeNode[] = [];

  data.forEach((item) => {
    treeMap[item.pid] = {
      ...item,
      children: [],
    };
  });

  data.forEach((item) => {
    if (item.ppid && treeMap[item.ppid]) {
      treeMap[item.ppid].children.push(treeMap[item.pid]);
    } else {
      rootNodes.push(treeMap[item.pid]);
    }
  });

  return rootNodes;
};

const ProcessTypeTag = ({ type }: { type: string }) => {
  const isInstalled = type === 'installed';
  return (
    <Tag color={isInstalled ? 'green' : 'red'} style={{ marginLeft: 8 }}>
      {isInstalled ? 'installed' : 'not installed'}
    </Tag>
  );
};

const TreeNode: React.FC<{
  node: ProcessTreeNode;
  level?: number;
  isLast?: boolean;
  parentIsLast?: boolean[];
}> = ({ node, level = 0, isLast = true, parentIsLast = [] }) => {
  const hasChildren = node.children.length > 0;
  const isRoot = level === 0;

  return (
    <div className="tree-node-wrapper">
      <div className="tree-node-content-wrapper">
        {/* Connection Lines */}
        {!isRoot && (
          <div className="tree-connections">
            {/* Vertical lines for parent levels */}
            {parentIsLast.map((isParentLast, index) => (
              <div
                key={index}
                className={`tree-vertical-line ${isParentLast ? '' : 'active'}`}
                style={{ left: `${index * 64 + 16}px` }}
              />
            ))}

            {/* L-shaped connector for current node */}
            <div
              className="tree-connector"
              style={{ left: `${(level - 1) * 64 + 16}px` }}
            >
              <div
                className={`connector-vertical ${
                  isLast ? 'last' : 'continuing'
                }`}
              />
              <div className="connector-horizontal" />
            </div>
          </div>
        )}

        {/* Node Content */}
        <div
          className={`tree-node-content ${isRoot ? 'root-node' : ''}`}
          style={{
            marginLeft: level * 64,
            backgroundColor: getBackgroundColor(level),
          }}
        >
          <div className="tree-node-header">
            <Text strong>{node.title || node.exe}</Text>
            <ProcessTypeTag type={node.process_type} />
          </div>

          <div className="tree-node-pids">
            <Text type="secondary">PID: {node.pid}</Text>
            <Text type="secondary">PPID: {node.ppid}</Text>
          </div>

          {node.exe && (
            <div className="tree-node-path">
              <Tooltip title={node.exe}>
                <Text type="secondary">
                  Path:{' '}
                  {node.exe.length > 40
                    ? `${node.exe.substring(0, 40)}...`
                    : node.exe}
                </Text>
              </Tooltip>
            </div>
          )}

          <div className="tree-node-time">
            <Text type="secondary">
              Created: {new Date(node.create_time).toLocaleString()}
            </Text>
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && (
        <div className="tree-children-container">
          {node.children.map((child, index) => {
            const isChildLast = index === node.children.length - 1;
            const newParentIsLast = [...parentIsLast, isLast];

            return (
              <TreeNode
                key={child.pid}
                node={child}
                level={level + 1}
                isLast={isChildLast}
                parentIsLast={newParentIsLast}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const getBackgroundColor = (level: number) => {
  const colors = [
    '#f0f9ff',
    '#f0fdf4',
    '#fff7ed',
    '#faf5ff',
    '#fff1f2',
    '#eff6ff',
  ];
  return colors[Math.min(level, colors.length - 1)];
};

export const ProcessTreeBox = ({ processes }: ProcessTreeBoxProps) => {
  const treeData = buildTree(processes);

  return (
    <div className="tree-container">
      <div className="tree-content">
        {treeData.map((node, index) => (
          <TreeNode
            key={node.pid}
            node={node}
            isLast={index === treeData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
