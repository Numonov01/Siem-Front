import { Col, Flex, Row } from 'antd';
import { useStylesContext } from '../context';
import { HomeOutlined, PieChartOutlined } from '@ant-design/icons';
import { PageHeader } from '../components';
import { DASHBOARD_ITEMS } from '../constants';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  const stylesContext = useStylesContext();

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

        <Row {...stylesContext?.rowProps}>
          <Col xs={24} lg={18}>
            About page
          </Col>
        </Row>
      </Flex>
    </div>
  );
};
