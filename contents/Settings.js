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
        <Card name="sett" title='Réglages des emails' bordered={true}>
            <SettingItem name= 'freq' title='Frequence' type='number' value={frequence} 
            onChange={(e)=>{
                setFrequence(e.target.value)
            }}
                description="Nombre maximum d'email reçus par jour."
            />
            <CombinedSettingItem settings={[
                {
                    title: 'Nouveaux fichiers', type: 'bool', value: file, onChange: (e)=>{
                        setFile(!file)
                    },
                    description: 'Recevoir un email quand un nouveau fichier est ajouté.'
                },
                {
                    title: 'Modifications de fichiers', type: 'bool', value:change, onChange: (e)=>{
                        setChange(!change)
                    },
                    description: 'Recevoir un email quand un fichier est modifié.'
                },
            ]}/>
            <CombinedSettingItem settings={[
                {
                    title: 'Nouveaux commentaires', type: 'bool', value: comment, onChange:(e)=> setComment(!comment),
                    description: 'Recevoir un email quand un nouveau commentaire est posté sur un fichier.'
                },
                {
                    title: 'Nouveaux messages', type: 'bool', value:message, onChange: (e)=>setMessage(!message),
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