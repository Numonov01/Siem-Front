import {
  Alert,
  Button,
  ButtonProps,
  Col,
  Input,
  Popover,
  Row,
  Table,
  Tabs,
  Tag,
  TagProps,
} from 'antd';
import {
  HomeOutlined,
  PieChartOutlined,
  QuestionOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { ReactNode, useEffect, useState } from 'react';
import {
  fetchBarList,
  fetchMismatchesTable,
  fetchMismatchesChart,
} from '../../service/default';
import {
  BarData,
  MismatchesItem,
  MismatchesLevelChart,
  MismatchesResponse,
} from '../../types/default';
import { DeviceListData } from '../../types/device_list';
import { Card, PageHeader } from '../../components';
import { fetchDeviceList } from '../../service/device_list';
import MitreAttackPieChart from './Charts/MitreAttackChart';
import { MismatchesLevelLineChart } from './Charts/LineChart';
import { SecurityEventsTable } from '../../components/dashboard/default/TabCard/SecurityEventsTable';

const { TabPane } = Tabs;

const SECURITY_TABS = [
  {
    key: 'all',
    label: 'All Events',
    icon: HomeOutlined,
    count: 0,
  },
  {
    key: 'high',
    label: 'High',
    icon: WarningOutlined,
    count: 0,
  },
  {
    key: 'medium',
    label: 'Medium',
    icon: WarningOutlined,
    count: 0,
  },
  {
    key: 'low',
    label: 'Low',
    icon: WarningOutlined,
    count: 0,
  },
];

const POPOVER_BUTTON_PROPS: ButtonProps = {
  type: 'text',
};

const cardStyles = {
  height: '100%',
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
  const [mismatchesData, setMismatchesData] = useState<MismatchesResponse>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [filteredData, setFilteredData] = useState<MismatchesItem[]>([]);
  const [mismatchesChartData, setMismatchesChartData] =
    useState<MismatchesLevelChart | null>(null);
  const [error, setError] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mismatchesData?.results) return;

    if (activeTab === 'all') {
      setFilteredData(mismatchesData.results);
    } else {
      setFilteredData(
        mismatchesData.results.filter((item) => item.rule.level === activeTab)
      );
    }
  }, [activeTab, mismatchesData]);

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
        setMismatchesData(
          Array.isArray(data)
            ? data[0] ?? { count: 0, next: null, previous: null, results: [] }
            : data
        );
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

  // line chart data
  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      try {
        const data = await fetchMismatchesChart();
        setMismatchesChartData(Array.isArray(data) ? data[0] ?? null : data);
      } catch (error) {
        console.error('Error fetching mismatches chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
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

        <Col xs={24} lg={12}>
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

        <Col xs={24} lg={12}>
          <Card
            title="Mismatches Level Trend"
            extra={
              <Popover
                content="Trend of mismatches by severity level over time"
                title="Mismatches Trend"
              >
                <Button icon={<QuestionOutlined />} {...POPOVER_BUTTON_PROPS} />
              </Popover>
            }
            style={cardStyles}
            loading={loading}
          >
            {mismatchesChartData ? (
              <MismatchesLevelLineChart data={mismatchesChartData} />
            ) : (
              <Alert message="No chart data available" type="info" />
            )}
          </Card>
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

            <SecurityEventsTable data={filteredData} loading={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
