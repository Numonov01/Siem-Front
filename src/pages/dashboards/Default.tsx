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
  Tooltip,
} from 'antd';
import { Card, PageHeader } from '../../components';
import {
  HomeOutlined,
  PieChartOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import {
  fetchBarList,
  fetchMismatchesRule,
  fetchMismatchesTable,
  fetchMismatchesLog,
} from '../../service/default';
import { BarData, MismatchesResponse, SigmaRule } from '../../types/default';
import MitreAttackPieChart from './MitreAttackChart';
import { fetchDeviceList } from '../../service/device_list';
import { DeviceListData } from '../../types/device_list';
import { ColumnsType } from 'antd/es/table';
import { NetworkEvent } from '../../types/event_logs';

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

const RULE_COLUMNS: ColumnsType<SigmaRule> = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (title: string) => (
      <Tooltip title={title}>
        {title.length > 30 ? `${title.substring(0, 30)}...` : title}
      </Tooltip>
    ),
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
    render: (description: string) => (
      <Tooltip title={description}>
        {description.length > 30
          ? `${description.substring(0, 30)}...`
          : description}
      </Tooltip>
    ),
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
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
];

const LOG_COLUMNS: ColumnsType<NetworkEvent> = [
  {
    title: 'Event id',
    dataIndex: 'EventId',
    key: 'EventId',
  },
  {
    title: 'User',
    dataIndex: ['Event', 'User'],
    key: 'User',
  },
  {
    title: 'LogonId',
    dataIndex: ['Event', 'LogonId'],
    key: 'LogonId',
  },

  {
    title: 'Company',
    dataIndex: ['Event', 'Company'],
    key: 'Company',
  },
  {
    title: 'OriginalFileName',
    dataIndex: ['Event', 'OriginalFileName'],
    key: 'OriginalFileName',
  },
  {
    title: 'Integrity Level',
    dataIndex: ['Event', 'IntegrityLevel'],
    key: 'IntegrityLevel',
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
  {
    title: 'Utc Time',
    dataIndex: ['Event', 'UtcTime'],
    key: 'UtcTime',
    render: (date: string) => {
      const originalDate = new Date(date);
      const adjustedDate = new Date(
        originalDate.getTime() + 5 * 60 * 60 * 1000
      );
      return adjustedDate.toLocaleString();
    },
  },
];

const ExpandedRow = ({ record }: { record: MismatchesResponse }) => {
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
  }, [record.log_id, record.rule.id]);

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Rule" key="1">
        {error.rule && <Alert message={error.rule} type="error" showIcon />}
        <Table
          columns={RULE_COLUMNS}
          dataSource={ruleData ? [ruleData] : []}
          pagination={false}
          bordered
          rowKey="id"
          loading={loading.rule}
          locale={{ emptyText: loading.rule ? 'Loading...' : 'No data found' }}
        />
      </TabPane>
      <TabPane tab="Log" key="2">
        {error.log && <Alert message={error.log} type="error" showIcon />}
        <Table
          columns={LOG_COLUMNS}
          dataSource={logData ? [logData] : []}
          pagination={false}
          bordered
          rowKey="EventId"
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

export const DefaultDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [barData, setBarData] = useState<BarData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceListData[]>([]);
  const [mismatchesData, setMismatchesData] = useState<MismatchesResponse[]>(
    []
  );
  const [error, setError] = useState<ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<MismatchesResponse[]>([]);

  // Tab o'zgarganda filtrni qo'llash
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
