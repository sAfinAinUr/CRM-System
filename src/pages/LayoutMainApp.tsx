import { ReactNode } from 'react';

import { Layout, theme } from 'antd';

import PageMenu from '../components/PageMenu';

const { Content, Sider } = Layout;

type Props = {
  children: ReactNode;
};

const LayoutMainApp: React.FC<Props> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{
        padding: '24px 0',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        width: '100%',
        height: 'calc(100dvh - 24px*2)',
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
          overflowY: 'scroll',
        }}>
        {children}
      </Content>
    </Layout>
  );
};

export default LayoutMainApp;
