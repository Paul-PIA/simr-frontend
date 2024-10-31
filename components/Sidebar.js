import React, { useEffect } from "react";
import { useState } from "react";
import { Layout, Menu } from "antd";
import { FileExcelOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "../services/api";

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Sider_({fix}) {
  const [collapsed, setCollapsed] = useState(false); // open and close the sider
  const [openKeys, setOpenKeys] = useState([]); //open and close subMenu
  const [contracts,setContracts]=useState([]);
  const [exercices,setExercices]=useState([]);
  const [files,setFiles]=useState([]);

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
    if (con.length>0){
    const exercises=await Promise.all(con.map(
      async (con)=>await apiClient({
        method:'GET',
        path:`exercise/?con=${con.id}`
      })
    ));
    if (exercises.length>0){
    const ex=exercises.reduce((pre, cur) => //exercises étant une liste de liste, il faut l'aplatir
      pre.concat(cur));
    setExercices(ex);
    const fich=await Promise.all(ex.map(
      async (exer)=>await apiClient({
        method:'GET',
        path:`file/?exer=${exer.id}`
      })
    ));
    if (fich.length>0){
    const fichiers=fich.reduce((pre, cur) =>
      pre.concat(cur));
const droits=await Promise.all(fichiers.map(
  async (file)=>await apiClient({
    method:'GET',
    path:`access/${file.id}/`
  })
));
setFiles(fichiers.filter((file,index)=>file.is_public || droits[index].user.includes(id) || droits[index].org.includes(org)))
}}}};

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
      style={{ ...fix,background: "#fff", padding: 0 }}
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
          <Menu.Item key={index+1} >  <a href={`${window.location.origin}/contract?id=${con.id}`} ></a>
            {con.name}</Menu.Item>
          ))}
        </SubMenu>
        <SubMenu
          key="sub2"
          title={collapsed ? null : "Mes Exercices"}
          icon={<TeamOutlined />}
        >
          {exercices.map((exer,index)=>(
            
          <Menu.Item key={index+1} > <a href={`${window.location.origin}/exercise?id=${exer.id}`}></a>
            {exer.name}</Menu.Item>
          ))}
        </SubMenu>
        <SubMenu
          key="sub3"
          title={collapsed ? null : "Mes Fichiers"}
          icon={<FileExcelOutlined />}
        >
          {files.map((file,index)=>(
          <Menu.Item key={index+1} > <a href={`${window.location.origin}/file?id=${file.id}`}></a>
            {file.name}</Menu.Item>
          ))}
        </SubMenu>
      </Menu>
    </Sider>
  );
}
