import { Layout, theme } from 'antd';
import PageMenu from '../components/PageMenu';
import { ReactNode } from 'react';

const { Content, Sider } = Layout;
type LayoutPageProps = {
  children: ReactNode;
};
const LayoutPage: React.FC<LayoutPageProps> = ({ children }) => {
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

export default LayoutPage;
