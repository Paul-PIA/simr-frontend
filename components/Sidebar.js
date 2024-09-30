import React, { useEffect } from "react";
import { useState } from "react";
import { Layout, Menu } from "antd";
import { BookOutlined, TeamOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "../services/api";

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function _Sider() {
  const [collapsed, setCollapsed] = useState(false); // open and close the sider
  const [openKeys, setOpenKeys] = useState([]); //open and close subMenu
  const [contracts,setContracts]=useState([])

  const fetchContracts=async ()=>{
    const token=localStorage.getItem('access');
    const decoded=jwtDecode(token);
    const id=decoded.user_id;
    const org=await apiClient({
      method:'GET',
      path:`user/${id}/`,
      data:{}
    }).org;
    const con=await apiClient({
      method:'GET',
      path:`contract/?org_icontains=${org}`
    });
    setContracts(con);
  };

  useEffect(()=>{fetchContracts()},[]);
  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    if (!latestOpenKey) {
      setOpenKeys([]);
    } else {
      setOpenKeys([latestOpenKey]);
    }
  };
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={200}
      style={{ background: "#fff", padding: 0 }}
    >
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        style={{ height: "100%", borderRight: 0 }}
      >
        <SubMenu
          key="sub1"
          title={collapsed ? null : "Contracts"}
          icon={<BookOutlined />}
        >
          {contracts.map((con,index)=>(
          <Menu.Item key={index+1} 
          onClick={()=>{window.location=`/contract?id=${con.id}`}}>
            {con.name}</Menu.Item>
          ))}
        </SubMenu>
        <SubMenu
          key="sub2"
          title={collapsed ? null : "My Firm"}
          icon={<TeamOutlined />}
        >
          <Menu.Item key="1">Fellow</Menu.Item>
          <Menu.Item key="2">Contact</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
}
