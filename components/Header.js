import React from 'react';
import { Layout, Avatar, Space } from 'antd';
import { UserOutlined, SettingOutlined, NotificationOutlined, LogoutOutlined,HomeFilled} from '@ant-design/icons';
import HomePageButton from './HomePageButton';
import { apiClient } from '../services/api';

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

export default function Header_({ onMenuClick }){
    return (
        <Header className="header" style={{ padding:0, background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <HomePageButton/>
            <div style={{ marginRight: 24}}>
                <Space size="middle">
                    <Avatar title={"Accueil"} style={{backgroundColor: '#0056b3',cursor:'pointer'}} icon ={<HomeFilled/>} onClick={()=>onMenuClick('')}/>
                    <Avatar title ={"Profil"} style={{ backgroundColor: '#87d068', cursor: 'pointer' }} icon={<UserOutlined />} onClick={() => onMenuClick('Profile')}/>
                    <Avatar title={"Notifications"} style={{ backgroundColor: '#f56a00', cursor: 'pointer' }} icon={<NotificationOutlined />} onClick={() => onMenuClick('Notifications')}/>
                    <Avatar title={"Paramètres"} style={{ backgroundColor: '#7265e6', cursor: 'pointer' }} icon={<SettingOutlined />} onClick={() => onMenuClick('Settings')}/>
                    <Avatar title={"Se déconnecter"} style={{ backgroundColor: '#ffbf00', cursor: 'pointer' }} icon={<LogoutOutlined />} 
                    onClick={async() => { await apiClient({
                        method:"POST",
                        path:"auth/logout/",
                        data:{access:localStorage.access}
                    });
                        window.location.href = '/auth'}}/>
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