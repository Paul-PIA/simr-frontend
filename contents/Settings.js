import React, { useEffect, useState } from 'react';
import { Card, Typography,Button} from 'antd';
import SettingItem from '../components/SettingItem';
import CombinedSettingItem from '../components/CombinedSettingItem';
import { apiClient, apiRefresh } from '../services/api';
import { jwtDecode } from 'jwt-decode';
const { Paragraph } = Typography;

export default function Settings() {
    async function GetSettings(){

        await apiRefresh();
          const token=localStorage.getItem('access');
          const decoded=jwtDecode(token);
          const id=decoded.user_id ;
        const response=await apiClient({
            method:'GET',
            path:`mailbell/${id}/`
        });
        setFrequence(response.frequence);
        setFile(response.newfile);
        setChange(response.newchange);
        setComment(response.newcomment);
        setMessage(response.newmessage);
};
    const [frequence, setFrequence] = useState(255);
    const [file, setFile] = useState(true);
    const [change, setChange] = useState(true);
    const [comment, setComment] = useState(true);
    const [message, setMessage] = useState(true);
    useEffect(()=>{GetSettings()},[])
    return (
        <div style={{flex:1}}>
            <title>Paramètres</title>
        <Card name="sett" title='Email Settings' bordered={true}>
            <SettingItem name= 'freq' title='Frequence' type='number' value={frequence} 
            onChange={(e)=>{
                setFrequence(e.target.value)
            }}
                description='Set the maximum of mails received everyday.'
            />
            <CombinedSettingItem settings={[
                {
                    title: 'New File', type: 'bool', value: file, onChange: (e)=>{
                        setFile(!file)
                    },
                    description: 'Receive emails when there are new files uploaded.'
                },
                {
                    title: 'New Change', type: 'bool', value:change, onChange: (e)=>{
                        setChange(!change)
                    },
                    description: 'Receive emails when there are new changes to the files.'
                },
            ]}/>
            <CombinedSettingItem settings={[
                {
                    title: 'New Comment', type: 'bool', value: comment, onChange:(e)=> setComment(!comment),
                    description: 'Receive emails when there are new comments to the files.'
                },
                {
                    title: 'New Message', type: 'bool', value:message, onChange: (e)=>setMessage(!message),
                    description: 'Receive emails when there are new messages from your fellow.'
                },
            ]}/>
            <Button onClick={async (e)=>{
                e.preventDefault;
                const token=localStorage.getItem('access');
                const decoded=jwtDecode(token);
                const id=decoded.user_id ;
                await apiClient({
                    method:'PATCH',
                    path:`mailbell/${id}/`,
                    data:{
                        frequence:frequence,
                        newfile:file,
                        newchange:change,
                        newcomment:comment,
                        newmessage:message
                    }
                });
                window.location=window.location
            }}>
                Save
            </Button>
        </Card>
        </div>

    );
}