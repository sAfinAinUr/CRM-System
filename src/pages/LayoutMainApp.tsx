import { Outlet } from 'react-router';

import { Layout, theme } from 'antd';

import PageMenu from '../components/PageMenu';
import { AuthProvider } from '../providers/AuthProvider';

const { Content, Sider } = Layout;

const LayoutMainApp: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  return (
    <AuthProvider>
      <Layout
        style={{
          padding: '24px 0',
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          width: '100%',
          height: 'calc(100dvh - 24px*2)'
        }}>
        <Sider style={{ background: colorBgContainer }}>
          <PageMenu />
        </Sider>
        <Content
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding: '0 24px',
            minHeight: 280,
            overflowY: 'scroll'
          }}>
          <Outlet />
        </Content>
      </Layout>
    </AuthProvider>
  );
};

export default LayoutMainApp;
