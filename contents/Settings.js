import React, { useState } from 'react';
import { Card, Typography} from 'antd';
import SettingItem from '../components/SettingItem';
import CombinedSettingItem from '../components/CombinedSettingItem';
const { Paragraph } = Typography;

export default function Settings() {
    const [frequence, setFrequence] = useState(5);
    const [file, setFile] = useState(true);
    const [change, setChange] = useState(true);
    const [comment, setComment] = useState(true);
    const [message, setMessage] = useState(true);

    return (
        <Card title='Email Settings' bordered={true}>
            <SettingItem title='Frequence' type='number' value={frequence} onChange={setFrequence}
                description='Set the maximum of mails received everyday.'
            />
            <CombinedSettingItem settings={[
                {
                    title: 'New File', type: 'bool', value: { file }, onChange: { setFile },
                    description: 'Receive emails when there are new files uploaded.'
                },
                {
                    title: 'New Change', type: 'bool', value: { change }, onChange: { setChange },
                    description: 'Receive emails when there are new changes to the files.'
                },
            ]}/>
            <CombinedSettingItem settings={[
                {
                    title: 'New Comment', type: 'bool', value: { comment }, onChange: { setComment },
                    description: 'Receive emails when there are new comments to the files.'
                },
                {
                    title: 'New Message', type: 'bool', value: { message }, onChange: { setMessage },
                    description: 'Receive emails when there are new messages from your fellow.'
                },
            ]}/>
        </Card>
    );
}