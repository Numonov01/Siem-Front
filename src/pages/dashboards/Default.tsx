import { PageHeader } from '../../components';
import { Col, Row } from 'antd';
import { HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { DASHBOARD_ITEMS } from '../../constants';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStylesContext } from '../../context';

export const DefaultDashboardPage = () => {
  const stylesContext = useStylesContext();

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
            menu: {
              items: DASHBOARD_ITEMS.map((d) => ({
                key: d.title,
                title: <Link to={d.path}>{d.title}</Link>,
              })),
            },
          },
          {
            title: 'default',
          },
        ]}
      />
      <Row {...stylesContext?.rowProps}>
        <Col xs={24} lg={18}>
          Default page
        </Col>
      </Row>
    </div>
  );
};
