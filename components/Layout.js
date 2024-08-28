import React,{ useState } from 'react';
import { Layout } from 'antd';
import _Footer from './Footer';
import _Header from './Header';
import _Sider from './Sidebar';
import Notifications from '../contents/Notifications';
import Settings from '../contents/Settings';
import Profile from '../contents/Profile';

const { Content } = Layout;

export default function _Layout({ item }) {
    const [content, setContent] = useState("This is index.");
    const HeaderClick = (contentKey) => {
        switch (contentKey) {
            case 'Notifications':
                setContent(<Notifications/>);
                break;
            case 'Settings':
                setContent(<Settings/>);
                break;
            case 'Profile':
                setContent(<Profile/>);
                break;
            default:
                setContent('This is index.');
        }
    };
    const SiderClick = (content) => {
        setContent(content);
    };
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <_Header onMenuClick={HeaderClick}/>
            <Layout>
                <_Sider onMenuClick={SiderClick} />
                <Content style={{ padding: '0 24px', minHeight: 280 }}>
                    {content}
                </Content>
            </Layout>
            <_Footer />
        </Layout>
    );
}