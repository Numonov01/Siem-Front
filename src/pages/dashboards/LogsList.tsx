import { HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { DeliveryTableCard, PageHeader } from '../../components';
import { Helmet } from 'react-helmet-async';

export const LogsListDashboardPage = () => {
  return (
    <div>
      <Helmet>
        <title>Logs Dashboard</title>
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
            // menu: {
            //   items: DASHBOARD_ITEMS.map((d) => ({
            //     key: d.title,
            //     title: <Link to={d.path}>{d.title}</Link>,
            //   })),
            // },
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
