import React from 'react';
import { Layout, Avatar, Space } from 'antd';
import { UserOutlined, SettingOutlined, NotificationOutlined, LogoutOutlined} from '@ant-design/icons';

const { Header } = Layout;

// const menu = (
//     <Menu>
//         <Menu.Item key="0">
//             <NotificationOutlined />Notifications
//         </Menu.Item>
//         <Menu.Item key="1">
//             <SettingOutlined />Settings
//         </Menu.Item>
//         <Menu.Divider />
//         <Menu.Item key="2">
//             <LogoutOutlined />Logout
//         </Menu.Item>
//     </Menu>
// );

export default function _Header(){
    return (
        <Header className="header" style={{ padding:0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ marginLeft: 24}}>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <span style={{ marginLeft: 8}}>Username</span>
            </div>
            <div style={{ marginRight: 24}}>
                <Space size="middle">
                    <Avatar style={{ backgroundColor: '#f56a00', cursor: 'pointer' }} icon={<NotificationOutlined />} onClick={() => console.log('Notificaitons')}/>
                    <Avatar style={{ backgroundColor: '#7265e6', cursor: 'pointer' }} icon={<SettingOutlined />} onClick={() => console.log('Settings')}/>
                    <Avatar style={{ backgroundColor: '#ffbf00', cursor: 'pointer' }} icon={<LogoutOutlined />} onClick={() => window.location.href = '/login'}/>
                    {/* <Dropdown>
                        <a onClick={e =>e.preventDefault()}>
                            <Space>
                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                            </Space>
                        </a>
                        {menu}
                    </Dropdown> */}
                </Space>
            </div>
        </Header>
    );
}