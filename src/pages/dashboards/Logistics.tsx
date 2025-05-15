import { Button, Col, Input, Row } from 'antd';
import { ApplicationListTable, Card, PageHeader } from '../../components';
import { useEffect, useState } from 'react';
import { HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { DASHBOARD_ITEMS } from '../../constants';
import { Link } from 'react-router-dom';
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

export const LogisticsDashboardPage = () => {
  const [activeTabKey, setActiveTabKey] = useState<string>('all');
  const [deviceData, setDeviceData] = useState<DeviceListData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchDeviceList();
        setDeviceData(data);
      } catch (error) {
        console.error('Fetch error:', error);
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
  };

  const handleBackToDevices = () => {
    setSelectedDeviceId(null);
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
        {selectedDeviceId && (
          <Button
            type="primary"
            onClick={handleBackToDevices}
            style={{ marginBottom: 16 }}
          >
            Back to Devices
          </Button>
        )}
        <Col span={24}>
          {selectedDeviceId ? (
            <Card title="Applications List">
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
              <DeviceListTable
                data={getFilteredData()}
                loading={loading}
                onAppListClick={handleAppListClick}
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};
