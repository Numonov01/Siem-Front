import { Col, Input, Row } from 'antd';
import { Card, PageHeader } from '../../components';
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
    switch (activeTabKey) {
      case 'active':
        return deviceData.filter((device) => device.is_active);
      case 'inactive':
        return deviceData.filter((device) => !device.is_active);
      default:
        return deviceData;
    }
  };

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <div>
      <Helmet>
        <title>Devices | Antd Dashboard</title>
      </Helmet>
      <PageHeader
        title="Devices Dashboard"
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
            title: 'Devices',
          },
        ]}
      />
      <Row>
        <Col span={24}>
          <Card
            title="Devices"
            extra={
              <Input.Search
                placeholder="search"
                style={{
                  width: window.innerWidth <= 768 ? '100%' : '400px',
                  marginLeft: window.innerWidth <= 768 ? 0 : '.5rem',
                }}
                size="middle"
              />
            }
            tabList={DEVICE_TABS}
            activeTabKey={activeTabKey}
            onTabChange={onTabChange}
          >
            <DeviceListTable data={getFilteredData()} loading={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
