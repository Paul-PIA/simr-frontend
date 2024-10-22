import React, { useState } from "react";
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

const list = [
  {
    id: 1,
    title: "notif 1",
    description: "",
    icon: "bell",
    user: "",
    time: "",
  },
  {
    id: 2,
    title: "notif 2",
    description: "",
    icon: "bell",
    user: "",
    time: "",
  },
  {
    id: 3,
    title: "notif 3",
    description: "",
    icon: "bell",
    user: "",
    time: "",
  },
];

export default function Notifications() {
  const [first,setFirst]=useState(true);
  async function RetrieveNotif(){
    const token=localStorage.getItem('access');
    const decoded=jwtDecode(token);
    const id=decoded.user_id ;
    const response=await apiClient({
      method:'GET',
      path:`notification/?receiver=${id}`
    });
    const l=[];
    for (let step = 0; step < response.length; step++){
      const user_info=await apiClient({
        method:'GET',
        path:`user/${response[step].actor}/`
      });
      l.push({
        id:step+1,
        notif_id:id,
        title:`notif ${step+1}`,
        description:response[step].message,
        icon:"bell",
        user_info:user_info,
        user:user_info.username,
        time:response[step].send_time,
        object:response[step].object,
        event:response[step].event
      })
    }
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
  const [data, setData] = useState(list);

  const total = list.length;
  const totalPages = Math.ceil(total / pageSize);
  const showTotal = (total, range) => `Total ${totalPages} pages`;

  if (first){
    RetrieveNotif();
    setFirst(false)
  };

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
              title={<a href="javascript:void(0);">{item.title}</a>}
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
