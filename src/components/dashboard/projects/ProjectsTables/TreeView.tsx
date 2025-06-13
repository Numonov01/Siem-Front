import { Tag, Tooltip, Typography, Button } from 'antd';
import { ProcessListData } from '../../../../types/process_list';
import './ProcessTreeView.css';
import { useEffect, useState } from 'react';

const { Text } = Typography;

type ProcessTreeNode = ProcessListData & {
  children: ProcessTreeNode[];
  x?: number;
  y?: number;
  level?: number;
  showAllChildren?: boolean;
  visibleChildren?: ProcessTreeNode[];
};

interface ProcessTreeBoxProps {
  processes: ProcessListData[];
}

const INITIAL_CHILDREN_LIMIT = 8;

const buildTree = (data: ProcessListData[]): ProcessTreeNode[] => {
  const treeMap: { [pid: number]: ProcessTreeNode } = {};
  const rootNodes: ProcessTreeNode[] = [];

  data.forEach((item) => {
    treeMap[item.pid] = {
      ...item,
      children: [],
      showAllChildren: false,
      visibleChildren: [],
    };
  });

  data.forEach((item) => {
    if (item.ppid && treeMap[item.ppid]) {
      treeMap[item.ppid].children.push(treeMap[item.pid]);
    } else {
      rootNodes.push(treeMap[item.pid]);
    }
  });

  // Initialize visible children for each node
  const initializeVisibleChildren = (node: ProcessTreeNode) => {
    node.visibleChildren = node.children.slice(0, INITIAL_CHILDREN_LIMIT);
    node.children.forEach((child) => initializeVisibleChildren(child));
  };

  rootNodes.forEach((node) => initializeVisibleChildren(node));

  return rootNodes;
};

const calculatePositions = (
  nodes: ProcessTreeNode[],
  containerWidth: number,
  containerHeight: number
) => {
  const levels: ProcessTreeNode[][] = [];

  const assignLevels = (node: ProcessTreeNode, level: number) => {
    if (!levels[level]) levels[level] = [];
    node.level = level;
    levels[level].push(node);
    // Use visibleChildren instead of all children for positioning
    node.visibleChildren?.forEach((child) => assignLevels(child, level + 1));
  };

  nodes.forEach((node) => assignLevels(node, 0));

  const nodeWidth = 280;
  const levelWidth = containerWidth / Math.max(levels.length, 1);
  const minLevelSpacing = 320;

  levels.forEach((levelNodes, levelIndex) => {
    const levelHeight = containerHeight / Math.max(levelNodes.length + 1, 1);
    const actualLevelWidth = Math.max(levelWidth, minLevelSpacing);

    levelNodes.forEach((node, nodeIndex) => {
      node.x = levelIndex * actualLevelWidth + nodeWidth / 2;
      node.y = (nodeIndex + 1) * levelHeight;
    });
  });

  return levels.flat();
};

const ProcessTypeTag = ({ type }: { type: string }) => {
  const isInstalled = type === 'installed';
  return (
    <Tag color={isInstalled ? 'green' : 'red'}>
      {isInstalled ? 'installed' : 'not installed'}
    </Tag>
  );
};

const CurvedConnection: React.FC<{
  from: ProcessTreeNode;
  to: ProcessTreeNode;
}> = ({ from, to }) => {
  if (!from.x || !from.y || !to.x || !to.y) return null;

  const startX = from.x + 140;
  const startY = from.y + 30;
  const endX = to.x - 140;
  const endY = to.y + 30;

  // Create curved path with better control points
  const controlPointX1 = startX + (endX - startX) * 0.4;
  const controlPointX2 = startX + (endX - startX) * 0.6;
  const controlPointY1 = startY;
  const controlPointY2 = endY;

  const pathData = `M ${startX} ${startY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${endX} ${endY}`;

  return (
    <path
      d={pathData}
      fill="none"
      stroke="#1890ff"
      strokeWidth="2"
      opacity="0.6"
      className="connection-path"
    />
  );
};

const ShowMoreButton: React.FC<{
  node: ProcessTreeNode;
  onShowMore: (node: ProcessTreeNode) => void;
}> = ({ node, onShowMore }) => {
  const hiddenCount =
    node.children.length - (node.visibleChildren?.length || 0);

  if (hiddenCount <= 0) return null;

  return (
    <Button
      size="small"
      type="link"
      onClick={(e) => {
        e.stopPropagation();
        onShowMore(node);
      }}
      style={{
        fontSize: '10px',
        height: '20px',
        padding: '0 6px',
        color: '#1890ff',
        background: 'rgba(24, 144, 255, 0.1)',
        border: '1px solid rgba(24, 144, 255, 0.3)',
        borderRadius: '10px',
        marginTop: '4px',
      }}
    >
      +{hiddenCount} more children
    </Button>
  );
};

const ProcessNode: React.FC<{
  node: ProcessTreeNode;
  onShowMore: (node: ProcessTreeNode) => void;
}> = ({ node, onShowMore }) => {
  if (!node.x || !node.y) return null;

  const getBackgroundColor = (level: number) => {
    const colors = [
      '#f0f9ff',
      '#f0fdf4',
      '#fff7ed',
      '#faf5ff',
      '#fff1f2',
      '#eff6ff',
    ];
    return colors[Math.min(level || 0, colors.length - 1)];
  };

  return (
    <div
      className="curved-tree-node"
      style={{
        left: node.x - 140,
        top: node.y - 30,
        backgroundColor: getBackgroundColor(node.level || 0),
      }}
    >
      {/* Always visible content */}
      <div className="tree-node-header">
        <Text strong>{node.title || node.exe}</Text>
        <ProcessTypeTag type={node.process_type} />
      </div>

      {/* Hover content - only shown on hover */}
      <div className="tree-node-hover-content">
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

        {node.children.length > 0 && (
          <div className="tree-node-children-count">
            <ShowMoreButton node={node} onShowMore={onShowMore} />
          </div>
        )}
      </div>
    </div>
  );
};

export const ProcessTreeBox = ({ processes }: ProcessTreeBoxProps) => {
  const [treeData, setTreeData] = useState<ProcessTreeNode[]>([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Initialize tree data
  useEffect(() => {
    setTreeData(buildTree(processes));
  }, [processes]);

  const handleShowMore = (node: ProcessTreeNode) => {
    const updateNode = (nodes: ProcessTreeNode[]): ProcessTreeNode[] => {
      return nodes.map((n) => {
        if (n.pid === node.pid) {
          return {
            ...n,
            showAllChildren: true,
            visibleChildren: n.children,
          };
        }
        return {
          ...n,
          visibleChildren: n.visibleChildren
            ? updateNode(n.visibleChildren)
            : [],
        };
      });
    };

    setTreeData((prevData) => updateNode(prevData));
  };

  // Calculate container dimensions based on visible tree structure
  const calculateTreeDimensions = (nodes: ProcessTreeNode[]) => {
    let maxLevels = 0;
    let maxNodesPerLevel = 0;

    const countLevels = (node: ProcessTreeNode, level: number) => {
      maxLevels = Math.max(maxLevels, level);
      node.visibleChildren?.forEach((child) => countLevels(child, level + 1));
    };

    nodes.forEach((node) => countLevels(node, 0));
    maxLevels += 1;

    // Count nodes at each level
    const levelCounts = Array(maxLevels).fill(0);
    const countAtLevel = (node: ProcessTreeNode, level: number) => {
      levelCounts[level]++;
      node.visibleChildren?.forEach((child) => countAtLevel(child, level + 1));
    };

    nodes.forEach((node) => countAtLevel(node, 0));
    maxNodesPerLevel = Math.max(...levelCounts);

    return { maxLevels, maxNodesPerLevel };
  };

  const { maxLevels, maxNodesPerLevel } = calculateTreeDimensions(treeData);
  const containerWidth = Math.max(maxLevels * 800, 1000);
  const containerHeight = Math.max(maxNodesPerLevel * 100 + 100, 600);

  const allNodes = calculatePositions(
    treeData,
    containerWidth,
    containerHeight
  );

  // Create connections using only visible children
  const connections: Array<{ from: ProcessTreeNode; to: ProcessTreeNode }> = [];

  const addConnections = (node: ProcessTreeNode) => {
    node.visibleChildren?.forEach((child) => {
      connections.push({ from: node, to: child });
      addConnections(child);
    });
  };

  treeData.forEach(addConnections);

  // Handle zoom events
  useEffect(() => {
    const handleZoom = (e: CustomEvent) => {
      const content = document.querySelector(
        '.curved-tree-content'
      ) as HTMLElement;
      if (!content) return;

      switch (e.detail) {
        case 'in':
          setScale((prev) => Math.min(prev * 1.2, 3));
          break;
        case 'out':
          setScale((prev) => Math.max(prev / 1.2, 0.5));
          break;
      }
    };

    const content = document.querySelector('.curved-tree-content');
    content?.addEventListener('zoom', handleZoom as EventListener);

    return () => {
      content?.removeEventListener('zoom', handleZoom as EventListener);
    };
  }, [containerWidth, containerHeight]);

  // Handle panning
  useEffect(() => {
    const content = document.querySelector(
      '.curved-tree-content'
    ) as HTMLElement;
    if (!content) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startPosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startPosition = { ...position };
      content.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      setPosition({
        x: startPosition.x + dx,
        y: startPosition.y + dy,
      });
    };

    const handleMouseUp = () => {
      isDragging = false;
      content.style.cursor = 'grab';
    };

    content.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      content.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position]);

  return (
    <div className="curved-tree-container">
      <div
        className="curved-tree-content"
        style={{
          width: containerWidth,
          height: containerHeight,
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          cursor: 'grab',
        }}
      >
        {/* SVG for curved connections */}
        <svg
          className="curved-tree-connections"
          width={containerWidth}
          height={containerHeight}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {connections.map((conn, index) => (
            <CurvedConnection
              key={`${conn.from.pid}-${conn.to.pid}-${index}`}
              from={conn.from}
              to={conn.to}
            />
          ))}
        </svg>

        {/* Process nodes */}
        {allNodes.map((node) => (
          <ProcessNode key={node.pid} node={node} onShowMore={handleShowMore} />
        ))}
      </div>
    </div>
  );
};
