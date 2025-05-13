import { HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { DeliveryTableCard, PageHeader } from '../../components';
import { DASHBOARD_ITEMS } from '../../constants';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export const SocialDashboardPage = () => {
  return (
    <div>
      <Helmet>
        <title>Social Dashboard</title>
      </Helmet>
      <PageHeader
        title="Logs Dashboard"
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
            title: 'Logs',
          },
        ]}
      />
      <DeliveryTableCard />
    </div>
  );
};
