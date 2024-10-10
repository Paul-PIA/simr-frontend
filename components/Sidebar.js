import React, { useEffect } from "react";
import { useState } from "react";
import { Layout, Menu } from "antd";
import { ApiOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "../services/api";

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function _Sider() {
  const [collapsed, setCollapsed] = useState(false); // open and close the sider
  const [openKeys, setOpenKeys] = useState([]); //open and close subMenu
  const [contracts,setContracts]=useState([]);
  const [exercices,setExercices]=useState([]);
  const [files,setFiles]=useState([]);
  const [access,setAccess]=useState([]);

  const fetchContractsAndMore=async ()=>{
    const token=localStorage.getItem('access');
    const decoded=jwtDecode(token);
    const id=decoded.user_id;
    const org=await apiClient({
      method:'GET',
      path:`user/${id}/`
    }).org;
    const con=await apiClient({
      method:'GET',
      path:`contract/?org_icontains=${org}`
    });
    setContracts(con);
    const exercises=await Promise.all(con.map(
      async (con)=>await apiClient({
        method:'GET',
        path:`exercise/?con=${con.id}`
      })
    ));
    const ex=exercises.reduce((pre, cur) =>
      pre.concat(cur));
    console.log(ex);
    setExercices(ex);
    const fich=await Promise.all(ex.map(
      async (exer)=>await apiClient({
        method:'GET',
        path:`file/?exer=${exer.id}`
      })
    ));
    const fichiers=fich.reduce((pre, cur) =>
      pre.concat(cur));
const droits=await Promise.all(fichiers.map(
  async (file)=>await apiClient({
    method:'GET',
    path:`access/${file.id}/`
  })
));
setFiles(fichiers.filter((file,index)=>file.is_public || droits[index].user.includes(id) || droits[index].org.includes(org)))
  };

  useEffect(()=>{fetchContractsAndMore()},[]);
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
          title={collapsed ? null : "Mes Contracts"}
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
          title={collapsed ? null : "Mes Exercices"}
          icon={<BookOutlined />}
        >
          {exercices.map((exer,index)=>(
          <Menu.Item key={index+1} 
          onClick={()=>{window.location=`/exercise?id=${exer.id}`}}>
            {exer.name}</Menu.Item>
          ))}
        </SubMenu>
        <SubMenu
          key="sub3"
          title={collapsed ? null : "Mes Fichiers"}
          icon={<BookOutlined />}
        >
          {files.map((file,index)=>(
          <Menu.Item key={index+1} 
          onClick={()=>{window.location=`/file?id=${file.id}`}}>
            {file.name}</Menu.Item>
          ))}
        </SubMenu>
      </Menu>
    </Sider>
  );
}
