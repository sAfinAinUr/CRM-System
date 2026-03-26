import { Outlet } from 'react-router';

import { Layout, theme } from 'antd';

import backgroundImage from '../assets/bgImgAuth.png';

const { Content, Sider } = Layout;

const LayoutAuth: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  return (
    <Layout
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        width: '100%'
      }}>
      <Sider
        width={911}
        breakpoint="xxl"
        collapsedWidth="0"
        trigger={null}
        style={{ background: colorBgContainer }}>
        <img src={backgroundImage} style={{ height: '100%', objectFit: 'cover' }} alt="bg" />
      </Sider>
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          padding: '40px 24px'
        }}>
        <div style={{ margin: 'auto', width: '100%' }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default LayoutAuth;
