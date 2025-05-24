import { Flex } from 'antd';
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { PageHeader } from '../components';
import { RulesCard } from '../components/dashboard/learning/CoursesCard/CoursesCard';

export const SitemapPage = () => {
  return (
    <div>
      <Flex vertical gap="middle">
        <PageHeader
          icon={<InfoCircleOutlined />}
          title="Rules"
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
              title: 'rules',
            },
          ]}
        />
        <Flex vertical gap="middle">
          <RulesCard />
        </Flex>
      </Flex>
    </div>
  );
};
