import {
  Button,
  Dropdown,
  Flex,
  FloatButton,
  Input,
  Layout,
  MenuProps,
  message,
  theme,
  Tooltip,
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  AppstoreOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  QuestionOutlined,
  SettingOutlined,
  UserOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup,
} from 'react-transition-group';
import { useMediaQuery } from 'react-responsive';
import SideNav from './SideNav.tsx';
import HeaderNav from './HeaderNav.tsx';
import FooterNav from './FooterNav.tsx';
import { NProgress } from '../../components';
import { PATH_LANDING } from '../../constants';
import { useTranslation } from './TranslationContext.tsx';

const { Content } = Layout;

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const [collapsed, setCollapsed] = useState(true);
  const [navFill, setNavFill] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setLanguage, t, loading } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const nodeRef = useRef(null);
  const floatBtnRef = useRef(null);

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-profile-link',
      label: t('Profile'),
      icon: <UserOutlined />,
    },
    {
      key: 'user-settings-link',
      label: t('Settings'),
      icon: <SettingOutlined />,
    },
    {
      key: 'user-help-link',
      label: t('Help Center'),
      icon: <QuestionOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'user-logout-link',
      label: t('Logout'),
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => {
        message.open({
          type: 'loading',
          content: t('Signing you out'),
        });

        setTimeout(() => {
          navigate(PATH_LANDING.signin);
        }, 1000);
      },
    },
  ];

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setNavFill(true);
      } else {
        setNavFill(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lang: 'en' | 'uz' | 'ru') => {
    setLanguage(lang);
  };

  const sidebarTooltip = collapsed
    ? t('Expand Sidebar')
    : t('Collapse Sidebar');

  return (
    <>
      <NProgress isAnimating={isLoading || loading} key={location.key} />
      <Layout
        style={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <SideNav
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={200}
          collapsedWidth={isMobile ? 0 : 80}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 10,
            borderRight: '1px solid #e8e8e8',
            backgroundColor: '#fff',
          }}
        />
        <Layout
          style={{
            marginLeft: collapsed ? (isMobile ? 0 : 80) : 200,
            transition: 'all 0.2s',
            backgroundColor: '#f5f5f5',
          }}
        >
          <HeaderNav
            style={{
              padding: '0 2rem 0 0',
              background: navFill ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
              backdropFilter: navFill ? 'blur(8px)' : 'none',
              boxShadow: navFill ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 9,
              gap: 8,
              transition: 'all 0.2s',
              backgroundColor: '#fff',
            }}
          >
            <Flex align="center">
              <Tooltip title={sidebarTooltip}>
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                  }}
                />
              </Tooltip>
              <Input.Search
                placeholder={t('Search')}
                style={{
                  width: isMobile ? '100%' : 400,
                  marginLeft: isMobile ? 0 : '.5rem',
                }}
                size="middle"
              />
            </Flex>
            <Flex align="center" gap="small">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'en',
                      label: 'English',
                      onClick: () => changeLanguage('en'),
                    },
                    {
                      key: 'uz',
                      label: 'Oʻzbekcha',
                      onClick: () => changeLanguage('uz'),
                    },
                    {
                      key: 'ru',
                      label: 'Русский',
                      onClick: () => changeLanguage('ru'),
                    },
                  ],
                }}
              >
                <Button icon={<GlobalOutlined />} type="text" size="large" />
              </Dropdown>
              <Tooltip title={t('Apps')}>
                <Button icon={<AppstoreOutlined />} type="text" size="large" />
              </Tooltip>
              <Tooltip title={t('Messages')}>
                <Button icon={<MessageOutlined />} type="text" size="large" />
              </Tooltip>
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <Flex>
                  <img
                    src="/jujutsu.jpg"
                    alt={t('User profile photo')}
                    height={36}
                    width={36}
                    style={{ borderRadius, objectFit: 'cover' }}
                  />
                </Flex>
              </Dropdown>
            </Flex>
          </HeaderNav>
          <Content
            style={{
              padding: '24px',
              minHeight: 'calc(100vh - 64px - 70px)',
              backgroundColor: 'transparent',
            }}
          >
            <TransitionGroup>
              <SwitchTransition>
                <CSSTransition
                  key={`css-transition-${location.key}`}
                  nodeRef={nodeRef}
                  onEnter={() => setIsLoading(true)}
                  onEntered={() => setIsLoading(false)}
                  timeout={300}
                  classNames="bottom-to-top"
                  unmountOnExit
                >
                  {() => (
                    <div
                      ref={nodeRef}
                      style={{
                        padding: 24,
                        minHeight: '100%',
                      }}
                    >
                      {children}
                    </div>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </TransitionGroup>
            <div ref={floatBtnRef}>
              <FloatButton.BackTop />
            </div>
          </Content>
          <FooterNav
            style={{
              textAlign: 'center',
              padding: '16px 0',
              backgroundColor: '#fff',
              borderTop: '1px solid #e8e8e8',
            }}
          />
        </Layout>
      </Layout>
    </>
  );
};
