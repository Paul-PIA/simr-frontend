import React, { useEffect } from "react";
import { useState } from "react";
import { Layout, Menu } from "antd";
import { FileExcelOutlined, BookOutlined, TeamOutlined,FormOutlined } from "@ant-design/icons";
import Link from 'next/link';
import { apiClient } from "../services/api";

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Sider_({fix}) {
  const [collapsed, setCollapsed] = useState(false); // open and close the sider
  const [openKeys, setOpenKeys] = useState([]); //open and close subMenu
  const [contracts,setContracts]=useState([]);
  const [exercices,setExercices]=useState([]);
  const [files,setFiles]=useState([]);
  const [isAdmin,setIsAdmin]=useState(false);

  const fetchContractsAndMore=async ()=>{
    try{
    const response=await apiClient({ //Requête optimisée pour envoyer au Sidebar les éléments nécessaires
      method:'GET',
      path:'sidebar/'
    });
    if (response.error){
      location='/InformationForm'
    }
  setContracts(response.contracts);
  setExercices(response.exercises);
  setFiles(response.files);
  setIsAdmin(response.isadmin)
} catch(error){
  location='/auth'
}};


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
          <Menu.Item key={"contract"+(index+1)} >  <Link href={`/contract?id=${con.id}`} ></Link>
            {con.name}</Menu.Item>
          ))}
        </SubMenu>
        <SubMenu
          key="sub2"
          title={collapsed ? null : "Mes Exercices"}
          icon={<TeamOutlined />}
        >
          {exercices.map((exer,index)=>(
            
          <Menu.Item key={"exercise"+(index+1)} > <Link href={`/exercise?id=${exer.id}`}></Link>
            {exer.name}</Menu.Item>
          ))}
        </SubMenu>
        <SubMenu
          key="sub3"
          title={collapsed ? null : "Mes Fichiers"}
          icon={<FileExcelOutlined />}
        >
          {files.map((file,index)=>(
          <Menu.Item key={"fil"+(index+1)} > <Link href={`/file?id=${file.id}`}></Link>
            {file.name}</Menu.Item>
          ))}
        </SubMenu>
        {isAdmin && (
        <SubMenu
        key="actions"
        title={collapsed ? null: "Actions"}
        icon={<FormOutlined />}>
          <Menu.Item key="new con"><Link href="/NewContract"></Link>
          Nouveau contract</Menu.Item>
          <Menu.Item key="new org"><Link href="/NewOrganization"></Link>
          Nouvelle organisation</Menu.Item>
        </SubMenu>)}{isAdmin &&(
        <SubMenu
        key="Ajout"
        title={collapsed ? null: "Ajouter des organisations aux contracts"}
        icon={<FormOutlined />}>
        {contracts.map((con,index)=>(
          <Menu.Item key={"Add"+(index+1)} >  <Link href={`/contract/AddOrg?id=${con.id}`} ></Link>
            {con.name}</Menu.Item>
          ))}
          </SubMenu>
          )}
      </Menu>
    </Sider>
  );
}
