import React from 'react';
import { useState } from 'react';
import { Layout } from 'antd';
import _Footer from './Footer';
import _Header from './Header';
import _Sider from './Sidebar';

const { Content } = Layout;

export default function _Layout({ children }) {
    const [content, setContent] = useState(true);
    const handleMenuClick = (content) => {
        setContent(content);
    };
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <_Header />
            <Layout>
                <_Sider onMenuClick={handleMenuClick} />
                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    {children}
                </Content>
            </Layout>
            <_Footer />
        </Layout>
    );
}