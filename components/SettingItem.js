import React from 'react';
import { InputNumber, Row, Switch, Typography } from 'antd';
const { Paragraph } = Typography;

export default function SettingItem({ title, description, type, value, onChange }) {//Here to control the format of setting bar
    //type = 'number','bool',...
    
    return (
        <div style={{ marginBottom: 16 }}>
            <Paragraph strong>{title}</Paragraph>
            <Paragraph type='secondary'>{description}</Paragraph>
            {type === 'number' ? (
                <InputNumber value={value} onChange={onChange} min={0}/>
            ) : (
                <Switch checked={value} onChange={onChange}/>
            )}
        </div>
    );
}