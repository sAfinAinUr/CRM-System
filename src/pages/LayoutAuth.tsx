import { Layout, theme } from 'antd';
import { ReactNode } from 'react';

import bgImg from '../assets/bgImgAuth.png';

const { Content, Sider } = Layout;
type LayoutPageProps = {
  children: ReactNode;
};
const LayoutAuth: React.FC<LayoutPageProps> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        width: '100%',
      }}>
      <Sider
        width={911}
        breakpoint="xxl"
        collapsedWidth="0"
        trigger={null}
        style={{ background: colorBgContainer }}>
        <img src={bgImg} style={{ height: '100%', objectFit: 'cover' }} alt="bg" />
      </Sider>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '0 24px',
          minHeight: 280,
          overflowY: 'auto',
        }}>
        {children}
      </Content>
    </Layout>
  );
};

export default LayoutAuth;
