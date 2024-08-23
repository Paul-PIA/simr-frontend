import React from 'react';
import { useState } from 'react';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function _Sider() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={200} style={{ background: '#fff' }}>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight:0 }}
            >
                <Menu.SubMenu key="1" title="Contracts">
                    <Menu.Item key='1' onClick={() => onMenuClick('Con1')}>Con1</Menu.Item>
                    <Menu.Item key='2' onClick={() => onMenuClick('Con2')}>Con2</Menu.Item>
                    <Menu.Item key='2' onClick={() => onMenuClick('Con3')}>Con3</Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu key="1" title="My Firm">
                    <Menu.Item key='1' onClick={() => onMenuClick('Fellow')}>Fellow</Menu.Item>
                    <Menu.Item key='2' onClick={() => onMenuClick('Contact')}>Contact</Menu.Item>
                </Menu.SubMenu>
            </Menu>
        </Sider>
    );
}