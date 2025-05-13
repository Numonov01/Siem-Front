import { Flex, Row, Typography } from 'antd';
import { useStylesContext } from '../context';
import { BranchesOutlined } from '@ant-design/icons';

export const SitemapPage = () => {
  const context = useStylesContext();

  return (
    <div>
      <Flex vertical gap="middle">
        <Typography.Title level={3}>
          <BranchesOutlined /> Sitemap
        </Typography.Title>
        <Row {...context?.rowProps}></Row>
      </Flex>
    </div>
  );
};
