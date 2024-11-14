import React, { useState,useEffect } from "react";
import {
  List,
  Avatar,
  Badge,
  Pagination,
  Button,
  Typography,
  notification,
} from "antd";
import { NotificationOutlined } from "@ant-design/icons";
const { Text, Paragraph } = Typography;
import { apiClient } from "../services/api";
import { jwtDecode } from "jwt-decode";

export default function Notifications() {
  async function RetrieveNotif(){
    const token=localStorage.getItem('access');
    const decoded=jwtDecode(token);
    const id=decoded.user_id ;
    const response=await apiClient({
      method:'GET',
      path:`notification/?receiver=${id}`
    });
    const l=await Promise.all(response.map( async (notif,step) => {
      const user_info=await apiClient({
        method:'GET',
        path:`user/${notif.actor}/`
      });
      return {
        id:step+1,
        notif_id:notif.id,
        title:`notif ${step+1}`,
        description:notif.message,
        icon:"bell",
        user_info:user_info,
        user:user_info.username,
        time:notif.send_time,
        object:notif.object,
        event:notif.event
      }
    }));
    setData(l)
  };
  const evenements={
    'C':'Created',
    'U':'Updated',
    'D':'Deleted',
    'S':'Shared'
  };
  const objets={
    'C':'a contract',
    'E':'an exercise',
    'F':'a file',
    'U':'a user',
    'M':'a comment',
    'T':'a team',
    'R':'a right'
  };
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 1;
  const [data, setData] = useState([]);

  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  const showTotal = (total, range) => `Total ${totalPages} pages`;

  useEffect(()=>{RetrieveNotif()},[]);

  const handleRead = (id) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        return { ...item, read: true };
      }
      return item;
    });
    setData(newData);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ flex: 1 }}>
      <title>Notifications</title>
      <List
        itemLayout="horizontal"
        dataSource={paginatedData}
        renderItem={(item) => (
          <List.Item
            key={item.id}

            style={item.read ? {} : { backgroundColor: "#e6f7ff" }}
          >
            <List.Item.Meta
              avatar={
                <Badge status={item.status} count={0}>
                  <Avatar icon={<NotificationOutlined />} />
                </Badge>
              }
              title={item.title}
              description={
                <>
                <Paragraph>{evenements[item.event]} {objets[item.object]}</Paragraph>
                  <Paragraph>{item.description}</Paragraph>
                  <Text type="secondary">
                    sent by {item.user} at {item.time}
                  </Text>
                </>
              }
            />
          </List.Item>
        )}
      />
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showTotal={showTotal}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
