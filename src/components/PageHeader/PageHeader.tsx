import React from 'react';
import { Breadcrumb, BreadcrumbProps, Divider, Space, Typography } from 'antd';

import './styles.css';

type Props = {
  icon?: React.ReactNode;
  title: string;
  breadcrumbs: BreadcrumbProps['items'];
} & React.HTMLAttributes<HTMLDivElement>;

export const PageHeader = ({ icon, breadcrumbs, title, ...others }: Props) => {
  return (
    <div {...others}>
      <Space direction="vertical" size="small">
        <Typography.Title
          level={4}
          style={{ padding: 0, margin: 0, textTransform: 'capitalize' }}
        >
          {icon}
          {title}
        </Typography.Title>
        <Breadcrumb items={breadcrumbs} className="page-header-breadcrumbs" />
      </Space>
      <Divider orientation="right" plain>
        <span style={{ textTransform: 'capitalize' }}>
          {icon} {title}
        </span>
      </Divider>
    </div>
  );
};
