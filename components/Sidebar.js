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
    const response=await apiClient({
      method:'GET',
      path:'sidebar/'
    });
    console.log(response);
  setContracts(response.contracts);
  setExercices(response.exercices);
  setFiles(response.files)
};
//On garde les fichiers qui sont publics, auxquels on a accès, ou auxquels notre organisation a accès


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
          <Menu.Item key={"contract"+(index+1)} >  <a href={`/contract?id=${con.id}`} ></a>
            {con.name}</Menu.Item>
          ))}
        </SubMenu>
        <SubMenu
          key="sub2"
          title={collapsed ? null : "Mes Exercices"}
          icon={<TeamOutlined />}
        >
          {exercices.map((exer,index)=>(
            
          <Menu.Item key={"exercise"+(index+1)} > <a href={`/exercise?id=${exer.id}`}></a>
            {exer.name}</Menu.Item>
          ))}
        </SubMenu>
        <SubMenu
          key="sub3"
          title={collapsed ? null : "Mes Fichiers"}
          icon={<FileExcelOutlined />}
        >
          {files.map((file,index)=>(
          <Menu.Item key={"fil"+(index+1)} > <a href={`/file?id=${file.id}`}></a>
            {file.name}</Menu.Item>
          ))}
        </SubMenu>
      </Menu>
    </Sider>
  );
}
