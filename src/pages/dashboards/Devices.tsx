import { Alert, Button, Col, Input, Row } from 'antd';
import { ApplicationListTable, Card, PageHeader } from '../../components';
import { ReactNode, useEffect, useState } from 'react';
import {
  HomeOutlined,
  PieChartOutlined,
  StepBackwardOutlined,
} from '@ant-design/icons';
import { DASHBOARD_ITEMS } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchDeviceList } from '../../service/device_list';
import { DeviceListTable } from '../../components/dashboard/projects/ProjectsTables/ProjectsTable';
import { DeviceListData } from '../../types/device_list';

const DEVICE_TABS = [
  {
    key: 'all',
    label: 'All devices',
  },
  {
    key: 'active',
    label: 'Active',
  },
  {
    key: 'inactive',
    label: 'Inactive',
  },
];

export const DevicesDashboardPage = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('all');
  const [deviceData, setDeviceData] = useState<DeviceListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<ReactNode | null>(null);

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

  const getFilteredData = () => {
    let filtered = deviceData;

    switch (activeTabKey) {
      case 'active':
        filtered = filtered.filter((device) => device.is_active);
        break;
      case 'inactive':
        filtered = filtered.filter((device) => !device.is_active);
        break;
    }

    if (searchText) {
      filtered = filtered.filter(
        (device) =>
          device.name.toLowerCase().includes(searchText.toLowerCase()) ||
          device.user.toLowerCase().includes(searchText.toLowerCase()) ||
          device.ip_address.includes(searchText)
      );
    }

    return filtered;
  };

  const handleAppListClick = (deviceId: number) => {
    setSelectedDeviceId(deviceId);
    console.log('App List clicked:', deviceId);
  };

  const handleBackToDevices = () => {
    setSelectedDeviceId(null);
  };
  const navigate = useNavigate();
  const handleTreeClick = (deviceId: number) => {
    navigate(`/about/${deviceId}`);
  };

  return (
    <div>
      <Helmet>
        <title>
          {selectedDeviceId ? 'Applications' : 'Devices'} | Dashboard
        </title>
      </Helmet>
      <PageHeader
        title={selectedDeviceId ? 'Applications' : 'Devices Dashboard'}
        breadcrumbs={[
          {
            title: (
              <>
                <HomeOutlined />
                <span>Home</span>
              </>
            ),
            path: '/',
          },
          {
            title: (
              <>
                <PieChartOutlined />
                <span>Dashboards</span>
              </>
            ),
            menu: {
              items: DASHBOARD_ITEMS.map((d) => ({
                key: d.title,
                title: <Link to={d.path}>{d.title}</Link>,
              })),
            },
          },
          {
            title: selectedDeviceId ? 'Applications' : 'Devices',
          },
        ]}
      />
      <Row>
        <Col span={24}>
          {selectedDeviceId ? (
            <Card
              title="Applications List"
              extra={
                <Button type="primary" onClick={handleBackToDevices}>
                  <StepBackwardOutlined /> Back to Devices
                </Button>
              }
            >
              <ApplicationListTable deviceId={selectedDeviceId} />
            </Card>
          ) : (
            <Card
              title="Devices List"
              tabList={DEVICE_TABS}
              activeTabKey={activeTabKey}
              onTabChange={setActiveTabKey}
              extra={
                <Input.Search
                  placeholder="Search devices..."
                  allowClear
                  style={{ width: 300 }}
                  size="middle"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              }
            >
              {error ? (
                <Alert
                  message="Error"
                  description={error.toString()}
                  type="error"
                  showIcon
                />
              ) : (
                <DeviceListTable
                  data={getFilteredData()}
                  loading={loading}
                  onAppListClick={handleAppListClick}
                  onTreeClick={handleTreeClick}
                  rowKey="pk"
                />
              )}
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};
