import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, Layout, Menu, MenuProps, SiderProps } from 'antd';
import {
  IdcardOutlined,
  LaptopOutlined,
  OrderedListOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Logo } from '../../components';
import { Link, useLocation } from 'react-router-dom';
import { PATH_DASHBOARD, PATH_LANDING } from '../../constants';
import { COLOR } from '../../App.tsx';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const items: MenuProps['items'] = [
  // getItem('Dashboards', 'dashboards', <PieChartOutlined />, [
  //   getItem(
  //     <Link to={PATH_DASHBOARD.default}>Default</Link>,
  //     'default',
  //     <PieChartOutlined />
  //   ),

  //   getItem(
  //     <Link to={PATH_DASHBOARD.social}>Logs list</Link>,
  //     'social',
  //     <OrderedListOutlined />
  //   ),

  //   getItem(
  //     <Link to={PATH_DASHBOARD.logistics}>Agents</Link>,
  //     'logistics',
  //     <LaptopOutlined />
  //   ),
  // ]),
  getItem(
    <Link to={PATH_DASHBOARD.default}>Default</Link>,
    'default',
    <PieChartOutlined />
  ),

  getItem(
    <Link to={PATH_DASHBOARD.social}>Logs list</Link>,
    'social',
    <OrderedListOutlined />
  ),

  getItem(
    <Link to={PATH_DASHBOARD.logistics}>Agents</Link>,
    'logistics',
    <LaptopOutlined />
  ),

  getItem(
    <Link to={PATH_DASHBOARD.chat}>Chat</Link>,
    'chat',
    <IdcardOutlined />
  ),

  // getItem(
  //   <Link to={PATH_ABOUT.root}>Tree</Link>,
  //   'about',
  //   <BranchesOutlined />
  // ),
  // getItem(
  //   <Link to={PATH_SITEMAP.root}>Rules</Link>,
  //   'sitemap',
  //   <InfoCircleOutlined />
  // ),

  // getItem('Pages', 'pages', null, [], 'group'),

  // getItem('User profile', 'user-profile', <UserOutlined />, [
  //   getItem(
  //     <Link to={PATH_USER_PROFILE.details}>Details</Link>,
  //     'details',
  //     null
  //   ),
  //   getItem(<Link to={PATH_USER_PROFILE.edit}>Edit</Link>, 'edit', null),
  // ]),
];

const rootSubmenuKeys = ['dashboards', 'corporate', 'user-profile'];

type SideNavProps = SiderProps;

const SideNav = ({ collapsed, ...others }: SideNavProps) => {
  const nodeRef = useRef(null);
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState(['']);
  const [current, setCurrent] = useState('');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  useEffect(() => {
    const paths = pathname.split('/');
    setOpenKeys(paths);
    setCurrent(paths[paths.length - 1]);
  }, [pathname]);

  return (
    <Sider
      ref={nodeRef}
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="80"
      {...others}
    >
      <Logo
        color="black"
        asLink
        href={PATH_LANDING.root}
        justify="center"
        gap="small"
        imgSize={{ h: 28, w: 28 }}
        style={{ padding: '1rem 0' }}
        collapsed={collapsed}
      />
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBg: 'none',
              itemSelectedBg: COLOR['100'],
              itemHoverBg: COLOR['50'],
              itemSelectedColor: COLOR['600'],
            },
          },
        }}
      >
        <Menu
          mode="inline"
          items={items}
          onClick={onClick}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[current]}
          style={{ border: 'none' }}
        />
      </ConfigProvider>
    </Sider>
  );
};

export default SideNav;
