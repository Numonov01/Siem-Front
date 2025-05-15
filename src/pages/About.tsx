import { Card, Flex } from 'antd';
import { HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { PageHeader } from '../components';
import { DASHBOARD_ITEMS } from '../constants';
import { Link } from 'react-router-dom';
import { ApplicationListTable } from '../components/dashboard/projects/ClientsTable/ClientsTable';

export const AboutPage = () => {
  return (
    <div>
      <Flex vertical gap="middle">
        <PageHeader
          title="About"
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
              menu: {
                items: DASHBOARD_ITEMS.map((d) => ({
                  key: d.title,
                  title: <Link to={d.path}>{d.title}</Link>,
                })),
              },
            },
            {
              title: 'about',
            },
          ]}
        />

        <Card title="Application List">
          <ApplicationListTable deviceId={1} />
        </Card>
      </Flex>
    </div>
  );
};
