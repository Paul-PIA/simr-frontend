import React from 'react';
import { Col, Row } from 'antd';
import SettingItem from './SettingItem';

export default function CombinedSettingItem({ settings }) {//Here to put several settings in one row
    return (
        <Row gutter={16}>
            {settings.map((item) => (
                <Col span={24 / settings.length} key={item.title}>
                    <SettingItem title={item.title} description={item.description} type={item.type} value={item.value} onChange={item.onChange}/>
                </Col>
            ))}
        </Row>
    );
}