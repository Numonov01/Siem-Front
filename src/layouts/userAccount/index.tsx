import { AppLayout } from '../app';
import { TabsProps } from 'antd';
import { Card } from '../../components';
import { Outlet, useLocation } from 'react-router-dom';
import { USER_PROFILE_ITEMS } from '../../constants';

import './styles.css';
import { useEffect } from 'react';

const TAB_ITEMS: TabsProps['items'] = USER_PROFILE_ITEMS.map((u) => ({
  key: u.title,
  label: u.title,
}));

export const UserAccountLayout = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(location);
    const k =
      TAB_ITEMS.find((d) => location.pathname.includes(d.key))?.key || '';

    console.log(k);
  }, [location]);

  return (
    <>
      <AppLayout>
        <Card className="user-profile-card-nav card">Accaunt</Card>
        <div style={{ marginTop: '1.5rem' }}>
          <Outlet />
        </div>
      </AppLayout>
    </>
  );
};
