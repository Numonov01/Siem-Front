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
      {!isRoot && (
        <div className="tree-connections">
          {parentIsLast.map((isParentLast, index) => (
            <div
              key={index}
              className={`tree-vertical-connector ${
                isParentLast ? 'hidden' : 'visible'
              }`}
              style={{ left: `${index * 32 + 16}px` }}
            />
          ))}

          <div
            className={`tree-current-connector ${
              isLast ? 'last-child' : 'has-siblings'
            }`}
            style={{ left: `${level * 32 + 16}px` }}
          />

          <div
            className="tree-horizontal-connector"
            style={{ left: `${level * 32 + 16}px` }}
          />
        </div>
      )}

      <div
        className={`tree-node-content ${isRoot ? 'root-node' : ''}`}
        style={{
          marginLeft: isRoot ? 0 : level * 32 + 24,
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
                {node.exe.length > 35
                  ? `${node.exe.substring(0, 35)}...`
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
    '#e6f7ff', // level 0 - root
    '#f6ffed', // level 1
    '#fff7e6', // level 2
    '#f9f0ff', // level 3
    '#fff0f6', // level 4
    '#f0f5ff', // level 5
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
