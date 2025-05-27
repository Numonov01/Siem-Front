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
import { fetchBarList, fetchMismatchesTable } from '../../service/default';
import { BarData, MismatchesResponse } from '../../types/default';
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
    title: 'Title',
    dataIndex: ['rule', 'title'],
    key: 'title',
  },
  {
    title: 'Device Name',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: 'Level',
    dataIndex: ['rule', 'level'],
    key: 'level',
    render: (_: string) => {
      let color: TagProps['color'];

      if (_ === 'low') {
        color = 'cyan';
      } else if (_ === 'medium') {
        color = 'geekblue';
      } else {
        color = 'magenta';
      }

      return (
        <Tag color={color} className="text-capitalize">
          {_}
        </Tag>
      );
    },
  },
];

const RULE_COLUMNS = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
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
    title: 'Level',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
];

const LOG_COLUMNS = [
  {
    title: 'Event ID',
    dataIndex: ['Event', 'EventHeader', 'EventDescriptor', 'Id'],
    key: 'eventId',
  },
  {
    title: 'Image',
    dataIndex: ['Event', 'Image'],
    key: 'image',
  },
  {
    title: 'File Version',
    dataIndex: ['Event', 'FileVersion'],
    key: 'fileVersion',
  },
  {
    title: 'Product',
    dataIndex: ['Event', 'Product'],
    key: 'product',
  },
  {
    title: 'Company',
    dataIndex: ['Event', 'Company'],
    key: 'company',
  },
  {
    title: 'Command Line',
    dataIndex: ['Event', 'CommandLine'],
    key: 'commandLine',
  },
  {
    title: 'User',
    dataIndex: ['Event', 'User'],
    key: 'user',
  },
];

const expandedRowRender = (record: MismatchesResponse) => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Rule" key="1">
        <Table
          columns={RULE_COLUMNS}
          dataSource={[record.rule]}
          pagination={false}
          bordered
          rowKey="id"
        />
      </TabPane>
      <TabPane tab="Log" key="2">
        <Table
          columns={LOG_COLUMNS}
          dataSource={[record.log]}
          pagination={false}
          bordered
          rowKey="EventId"
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
  const [mismatchesData, setMismatchesData] = useState<MismatchesResponse[]>(
    []
  );
  const [error, setError] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  // pie 1
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

  // table1
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

  // table2
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchMismatchesTable();
        setMismatchesData(data);
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
            {error && <Alert message={error} type="error" />}

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
              dataSource={mismatchesData?.results || []}
              columns={EVENT_COLUMNS}
              rowKey="id"
              expandable={{ expandedRowRender }}
              className="overflow-scroll"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              locale={{ emptyText: loading ? 'Loading...' : 'No data found' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
