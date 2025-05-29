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
import { Card, PageHeader } from '../../components';
import {
  HomeOutlined,
  PieChartOutlined,
  QuestionOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import {
  fetchBarList,
  fetchMismatchesRule,
  fetchMismatchesTable,
  fetchMismatchesLog,
  fetchMismatchesChart,
} from '../../service/default';
import {
  BarData,
  MismatchesItem,
  MismatchesLevelChart,
  MismatchesResponse,
  SigmaRule,
} from '../../types/default';
import MitreAttackPieChart from './MitreAttackChart';
import { fetchDeviceList } from '../../service/device_list';
import { DeviceListData } from '../../types/device_list';
import { ColumnsType } from 'antd/es/table';
import { NetworkEvent } from '../../types/event_logs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ArcElement
);

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

const EVENT_COLUMNS: ColumnsType<MismatchesResponse> = [
  {
    title: 'Rule id',
    dataIndex: ['rule', 'id'],
    key: 'id',
  },
  {
    title: 'Device Name',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: 'Title',
    dataIndex: ['rule', 'title'],
    key: 'title',
  },
  {
    title: 'Log id',
    dataIndex: 'log_id',
    key: 'log_id',
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

const ExpandedRow = ({ record }: { record: MismatchesItem }) => {
  const [ruleData, setRuleData] = useState<SigmaRule | null>(null);
  const [logData, setLogData] = useState<NetworkEvent | null>(null);
  const [loading, setLoading] = useState({
    rule: false,
    log: false,
  });
  const [error, setError] = useState({
    rule: null as ReactNode | null,
    log: null as ReactNode | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, rule: true }));
        const rule = await fetchMismatchesRule(record.rule.id);
        setRuleData(rule);
        setError((prev) => ({ ...prev, rule: null }));
      } catch (err) {
        console.error('Error fetching rule:', err);
        setError((prev) => ({
          ...prev,
          rule: err instanceof Error ? err.message : 'Failed to load rule data',
        }));
      } finally {
        setLoading((prev) => ({ ...prev, rule: false }));
      }

      try {
        setLoading((prev) => ({ ...prev, log: true }));
        const log = await fetchMismatchesLog(record.log_id);
        setLogData(log);
        setError((prev) => ({ ...prev, log: null }));
      } catch (err) {
        console.error('Error fetching log:', err);
        setError((prev) => ({
          ...prev,
          log: err instanceof Error ? err.message : 'Failed to load log data',
        }));
      } finally {
        setLoading((prev) => ({ ...prev, log: false }));
      }
    };

    fetchData();
  }, [record.rule.id, record.log_id]);

  const VERTICAL_TABLE_COLUMNS = [
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
      width: '30%',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: '70%',
      render: (value: unknown) => {
        if (typeof value === 'object' && value !== null)
          return JSON.stringify(value);
        return String(value);
      },
    },
  ];

  const getRuleData = () => {
    if (!ruleData) return [];

    return [
      { field: 'Title', value: ruleData.title },
      { field: 'Description', value: ruleData.description },
      { field: 'Status', value: ruleData.status },
      { field: 'Level', value: ruleData.level },
      { field: 'Tags', value: ruleData.tags.join(' => ') },
      { field: 'References', value: ruleData.references.join(' => ') },
      { field: 'Author', value: ruleData.author },
      { field: 'Date', value: ruleData.date },
    ];
  };

  const getLogData = () => {
    if (!logData) return [];

    return [
      { field: 'Event ID', value: logData.EventId },
      { field: 'User', value: logData.Event?.User },
      { field: 'Image', value: logData.Event?.Image },
      { field: 'Company', value: logData.Event?.Company },
      { field: 'Command Line', value: logData.Event?.CommandLine },
      { field: 'Parent Image', value: logData.Event?.ParentImage },
      { field: 'Parent Command Line', value: logData.Event?.ParentCommandLine },
      { field: 'Original File Name', value: logData.Event?.OriginalFileName },
      { field: 'Integrity Level', value: logData.Event?.IntegrityLevel },
      {
        field: 'UTC Time',
        value: logData.Event?.UtcTime
          ? new Date(logData.Event.UtcTime).toLocaleString()
          : null,
      },
    ];
  };

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Rule" key="1">
        {error.rule && <Alert message={error.rule} type="error" showIcon />}
        <Table
          columns={VERTICAL_TABLE_COLUMNS}
          dataSource={getRuleData()}
          pagination={false}
          bordered
          showHeader={false}
          rowKey="field"
          loading={loading.rule}
          locale={{ emptyText: loading.rule ? 'Loading...' : 'No data found' }}
        />
      </TabPane>
      <TabPane tab="Log" key="2">
        {error.log && <Alert message={error.log} type="error" showIcon />}
        <Table
          columns={VERTICAL_TABLE_COLUMNS}
          dataSource={getLogData()}
          pagination={false}
          bordered
          showHeader={false}
          rowKey="field"
          loading={loading.log}
          locale={{ emptyText: loading.log ? 'Loading...' : 'No data found' }}
        />
      </TabPane>
    </Tabs>
  );
};

const POPOVER_BUTTON_PROPS: ButtonProps = {
  type: 'text',
};

const cardStyles: CSSProperties = {
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

const MismatchesLevelLineChart = ({ data }: { data: MismatchesLevelChart }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor:
        dataset.label === 'High'
          ? 'rgb(255, 99, 132)'
          : dataset.label === 'Medium'
            ? 'rgb(54, 162, 235)'
            : 'rgb(75, 192, 192)',
      backgroundColor:
        dataset.label === 'High'
          ? 'rgba(255, 99, 132, 0.5)'
          : dataset.label === 'Medium'
            ? 'rgba(54, 162, 235, 0.5)'
            : 'rgba(75, 192, 192, 0.5)',
      tension: 0.1,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export const DefaultDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [barData, setBarData] = useState<BarData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceListData[]>([]);
  const [mismatchesData, setMismatchesData] = useState<MismatchesResponse[]>(
    []
  );
  const [mismatchesChartData, setMismatchesChartData] =
    useState<MismatchesLevelChart | null>(null);
  const [error, setError] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<MismatchesResponse[]>([]);

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

            <Table
              dataSource={filteredData}
              columns={EVENT_COLUMNS}
              rowKey="id"
              expandable={{
                expandedRowRender: (record) => <ExpandedRow record={record} />,
              }}
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
