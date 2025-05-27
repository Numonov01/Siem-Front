import {
  Alert,
  Button,
  ButtonProps,
  Col,
  Flex,
  Input,
  Popover,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  TagProps,
  Typography,
} from 'antd';
import { Card, MarketingSocialStatsCard, PageHeader } from '../../components';
import {
  ArrowUpOutlined,
  HomeOutlined,
  PieChartOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import CountUp from 'react-countup';
import { Area } from '@ant-design/charts';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { fetchBarList } from '../../service/default';
import { BarData } from '../../types/default';
import MitreAttackPieChart from './MitreAttackChart';
import { fetchDeviceList } from '../../service/device_list';
import { DeviceListData } from '../../types/device_list';

const { TabPane } = Tabs;

const SECURITY_TABS = [
  {
    key: 'all',
    label: 'All Events',
  },
  {
    key: 'high',
    label: 'High',
  },
  {
    key: 'medium',
    label: 'Medium',
  },
  {
    key: 'low',
    label: 'Low',
  },
];

const EVENT_COLUMNS = [
  {
    title: 'Vendor',
    dataIndex: 'vendor',
    key: 'vendor',
  },
  {
    title: 'Server',
    dataIndex: 'server',
    key: 'server',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

const MATCH_COLUMNS = [
  {
    title: 'Rule Title',
    dataIndex: 'ruleTitle',
    key: 'ruleTitle',
  },
  {
    title: 'Rule ID',
    dataIndex: 'ruleId',
    key: 'ruleId',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Author',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: 'Modified',
    dataIndex: 'modified',
    key: 'modified',
  },
];

const MAIN_COLUMNS = [
  {
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
];

const data = [
  {
    key: '1',
    level: 'High',
    time: '2025-05-26 16:45:38',
    message: 'Sigma match found',
    title: 'Remote Thread Created in Shell Application',
    description: 'Detects remote thread creation in command shell applications',
    match: [
      {
        key: '1-1',
        ruleTitle: 'Remote Thread Created in Shell Application',
        ruleId: 'r2644b3fa-8f6c4-11bc-8f0d1-30b9fda7b46f',
        description:
          'Detects remote thread creation in command shell applications, such as "cmd.DXE" and "PowerShell.EXE". It is a common technique used by malware, such as bcdfll, to inject malicious code and execute it within legitimate processes.',
        author: 'Splunk Research Team',
        modified: '2024/07/29',
      },
    ],
    event: [
      {
        key: '1-2',
        vendor: 'cmd.exe in TargetImage',
        server: 'Splunk Research Team',
        status: 'Event',
      },
    ],
  },
  {
    key: '2',
    level: 'Medium',
    time: '2025-05-26 14:30:22',
    message: 'Suspicious process detected',
    title: 'Unusual Process Execution',
    description: 'Detected unusual process execution pattern',
    match: [
      {
        key: '2-1',
        ruleTitle: 'Unusual Process Execution',
        ruleId: 'a1234b5c6-7d8e9-10fg-11hi-12jklmno13p',
        description:
          'Detects unusual process execution patterns that may indicate malicious activity',
        author: 'Security Team',
        modified: '2024/08/15',
      },
    ],
    event: [
      {
        key: '2-2',
        vendor: 'explorer.exe',
        server: 'Corporate Security',
        status: 'Alert',
      },
    ],
  },
];

type MainDataType = {
  key: string;
  level: string;
  time: string;
  message: string;
  title: string;
  description: string;
  match: {
    key: string;
    ruleTitle: string;
    ruleId: string;
    description: string;
    author: string;
    modified: string;
  }[];
  event: {
    key: string;
    vendor: string;
    server: string;
    status: string;
  }[];
};

const expandedRowRender = (record: MainDataType) => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Match" key="1">
        <Table
          columns={MATCH_COLUMNS}
          dataSource={record.match}
          pagination={false}
          bordered
        />
      </TabPane>
      <TabPane tab="Event" key="2">
        <Table
          columns={EVENT_COLUMNS}
          dataSource={record.event}
          pagination={false}
          bordered
        />
      </TabPane>
    </Tabs>
  );
};

const { Title } = Typography;

const POPOVER_BUTTON_PROPS: ButtonProps = {
  type: 'text',
};

const cardStyles: CSSProperties = {
  height: '100%',
};

const SalesChart = () => {
  const data = [
    {
      country: 'Online Store',
      date: 'Jan',
      value: 1390.5,
    },
    {
      country: 'Online Store',
      date: 'Feb',
      value: 1469.5,
    },
    {
      country: 'Online Store',
      date: 'Mar',
      value: 1521.7,
    },
    {
      country: 'Online Store',
      date: 'Apr',
      value: 1615.9,
    },
    {
      country: 'Online Store',
      date: 'May',
      value: 1703.7,
    },
    {
      country: 'Online Store',
      date: 'Jun',
      value: 1767.8,
    },
    {
      country: 'Online Store',
      date: 'Jul',
      value: 1806.2,
    },
    {
      country: 'Online Store',
      date: 'Aug',
      value: 1903.5,
    },
    {
      country: 'Online Store',
      date: 'Sept',
      value: 1986.6,
    },
    {
      country: 'Online Store',
      date: 'Oct',
      value: 1952,
    },
    {
      country: 'Online Store',
      date: 'Nov',
      value: 1910.4,
    },
    {
      country: 'Online Store',
      date: 'Dec',
      value: 2015.8,
    },
    {
      country: 'Facebook',
      date: 'Jan',
      value: 109.2,
    },
    {
      country: 'Facebook',
      date: 'Feb',
      value: 115.7,
    },
    {
      country: 'Facebook',
      date: 'Mar',
      value: 120.5,
    },
    {
      country: 'Facebook',
      date: 'Apr',
      value: 128,
    },
    {
      country: 'Facebook',
      date: 'May',
      value: 134.4,
    },
    {
      country: 'Facebook',
      date: 'Jun',
      value: 142.2,
    },
    {
      country: 'Facebook',
      date: 'Jul',
      value: 157.5,
    },
    {
      country: 'Facebook',
      date: 'Aug',
      value: 169.5,
    },
    {
      country: 'Facebook',
      date: 'Sept',
      value: 186.3,
    },
    {
      country: 'Facebook',
      date: 'Oct',
      value: 195.5,
    },
    {
      country: 'Facebook',
      date: 'Nov',
      value: 198,
    },
    {
      country: 'Facebook',
      date: 'Dec',
      value: 211.7,
    },
  ];

  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'country',
    slider: {
      start: 0.1,
      end: 0.9,
    },
  };

  return <Area {...config} />;
};

const PRODUCTS_COLUMNS = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: 'OS name',
    dataIndex: 'os_name',
    key: 'os_name',
  },
  {
    title: 'Last active',
    dataIndex: 'last_active',
    key: 'last_active',
    render: (date: string) => new Date(date).toLocaleString(),
  },
  {
    title: 'Ip address',
    dataIndex: 'ip_address',
    key: 'ip_address',
  },
  {
    title: 'MAC address',
    dataIndex: 'mac_address',
    key: 'mac_address',
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

export const DefaultDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [barData, setBarData] = useState<BarData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceListData[]>([]);
  const [error, setError] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredData = data.filter((item) => {
    const tabFilter =
      activeTab === 'all' ||
      (activeTab === 'high' && item.level === 'High') ||
      (activeTab === 'medium' && item.level === 'Medium') ||
      (activeTab === 'low' && item.level === 'Low');

    return tabFilter;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchBarList();
        setBarData(data);
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xato:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchDeviceList();
        setDeviceData(data);
        setError(null);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to load data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Default | Antd Dashboard</title>
      </Helmet>
      <PageHeader
        title="default dashboard"
        breadcrumbs={[
          {
            title: (
              <>
                <HomeOutlined />
                <span>home</span>
              </>
            ),
            path: '/',
          },
          {
            title: (
              <>
                <PieChartOutlined />
                <span>dashboards</span>
              </>
            ),
          },
          {
            title: 'default',
          },
        ]}
      />
      <Row
        gutter={[
          { xs: 8, sm: 16, md: 24, lg: 32 },
          { xs: 8, sm: 16, md: 24, lg: 32 },
        ]}
      >
        <Col xs={24} lg={24}>
          <Card title="Device agents" style={cardStyles}>
            {error ? (
              <Alert message={error} type="error" />
            ) : (
              <Table
                dataSource={deviceData.filter((item) => item.pk === 2)}
                columns={PRODUCTS_COLUMNS}
                className="overflow-scroll"
                rowKey="pk"
                loading={loading}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={32}>
          <Card
            title="MITRE ATT&CK Techniques Distribution"
            extra={
              <Popover
                content="Distribution of detected MITRE ATT&CK techniques"
                title="Techniques"
              >
                <Button icon={<QuestionOutlined />} {...POPOVER_BUTTON_PROPS} />
              </Popover>
            }
            style={cardStyles}
            loading={loading}
          >
            <MitreAttackPieChart data={barData} />
          </Card>
        </Col>

        {/* Graph */}
        <Col xs={24} lg={12}>
          <Card
            title="Overall sales"
            extra={
              <Popover content="Total sales over period x" title="Total sales">
                <Button icon={<QuestionOutlined />} {...POPOVER_BUTTON_PROPS} />
              </Popover>
            }
            style={cardStyles}
          >
            <Flex vertical gap="middle">
              <Space>
                <Title level={3} style={{ margin: 0 }}>
                  $ <CountUp end={24485.67} />
                </Title>
                <Tag color="green-inverse" icon={<ArrowUpOutlined />}>
                  8.7%
                </Tag>
              </Space>
              <SalesChart />
            </Flex>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <MarketingSocialStatsCard style={{ height: '100%' }} />
        </Col>

        <Col span={24}>
          <Card
            title="Security Events"
            extra={
              <Input.Search
                placeholder="Search logs..."
                style={{
                  width: window.innerWidth <= 768 ? '100%' : '300px',
                  marginLeft: window.innerWidth <= 768 ? 0 : '.5rem',
                }}
                size="middle"
              />
            }
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              style={{ marginBottom: 16 }}
            >
              {SECURITY_TABS.map((tab) => (
                <TabPane tab={tab.label} key={tab.key} />
              ))}
            </Tabs>
            <Table
              columns={MAIN_COLUMNS}
              dataSource={filteredData}
              expandable={{ expandedRowRender }}
              className="overflow-scroll"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
