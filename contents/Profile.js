import React, { useState } from 'react';
import { Button, Card, Input, Typography} from 'antd';
const { Paragraph } = Typography;

export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        first_name: 'default first',
        last_name: 'default last',
        email: 'default email',
        tel: 'default phone'
    });
    const [editProfile, setEditProfile] = useState(profile);

    const handleEditToggle = () => {
        if (isEditing) {
            setProfile(editProfile);
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfile(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{ flex: 1 }}>
            <Card title='Profile' extra={<Button onClick={handleEditToggle}>
                {isEditing ? 'save' : 'edit'}
            </Button>}>
                <p><strong>First name: </strong>{
                    isEditing ? <Input name='first' value={editProfile.first_name} onChange={handleInputChange} /> : profile.first_name
                }</p>
                <p><strong>Last name: </strong>{
                    isEditing ? <Input name='last' value={editProfile.last_name} onChange={handleInputChange} /> : profile.last_name
                }</p>
                <p><strong>Email adress: </strong>{
                    isEditing ? <Input name='email' value={editProfile.email} onChange={handleInputChange} /> : profile.email
                }</p>
                <p><strong>Telephone: </strong>{
                    isEditing ? <Input name='tel' value={editProfile.tel} onChange={handleInputChange} /> : profile.tel
                }</p>
            </Card>
        </div>
        
    )
}