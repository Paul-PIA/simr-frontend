import React, { useState } from 'react';
import { List, Avatar, Badge, Pagination, Button, Typography, notification} from 'antd';
import { NotificationOutlined } from '@ant-design/icons';
const { Text, Paragraph } = Typography;

const list = [
    {
        id: 1,
        title: 'notif 1',
        description: 'create a contract',
        icon: 'bell',
        read: true,
        user: 'Paul',
        time: 'yesterday'
    },
    {
        id: 2,
        title: 'notif 2',
        description: 'create an exercise',
        icon: 'bell',
        read: false,
        user: 'Paul',
        time: 'today'
    },
    {
        id: 3,
        title: 'notif 3',
        description: 'upload a file',
        icon: 'bell',
        read: false,
        user: 'Giulio',
        time: 'tomorrow'
    }
];

export default function Notifications() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 1;
    const [data, setData] = useState(list);
    
    const total = list.length;
    const totalPages = Math.ceil(total / pageSize);
    const showTotal = (total, range) => `Total ${totalPages} pages`;

    const handleRead = (id) => {
        const newData = data.map(item => {
            if (item.id === id) {
                return { ...item, read: true };
            }
            return item;
        })
        setData(newData);
    };

    const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div>
            <List itemLayout='horizontal' dataSource={paginatedData}
                renderItem={item => (
                    <List.Item 
                        key={item.id}
                        actions={[<Button
                            key={`btn-${item.id}`}
                            type="link"
                            onClick={() => handleRead(item.id)}
                            disabled={item.read}
                        >
                            Mark as read
                        </Button>]}
                        style={item.read ? {} : { backgroundColor: '#e6f7ff' }}
                    >
                        <List.Item.Meta
                            avatar={<Badge status={item.status} count={0}>
                                <Avatar icon={<NotificationOutlined />} />
                            </Badge>}
                            title={<a href="javascript:void(0);">{item.title}</a>}
                            description={<>
                                <Paragraph>{item.description}</Paragraph>
                                <Text type='secondary'>sent by {item.user} at {item.time}</Text>
                            </>}
                        />
                    </List.Item>
                )}
            />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <Pagination current={currentPage} pageSize={pageSize} total={total} showTotal={showTotal}
                    onChange={page => setCurrentPage(page)}
                />
            </div>
        </div>
    );
}