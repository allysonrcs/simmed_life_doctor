import React from 'react'
import { useEffect, useState } from 'react';
import { MeetingProvider, lightTheme } from 'amazon-chime-sdk-component-library-react';
import { ThemeProvider } from 'styled-components';
import MeetingForm from '../components/MeetingForm';
import Meeting from '../components/Meeting';
import Spinner from '../components/Spinner';
import { useParams } from 'react-router-dom'


export default function Consultorio() {
    const { meetingId: mid, userId: uid } = useParams();
    const [meetingId, setMeetingId] = useState('');
    const [userId, setUserId] = useState('');
    const [inMeeting, setInMeeting] = useState(false);
    const [joinData, setJoinData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token') || '';

        if (mid && uid) {
            setMeetingId(mid);
            setUserId(uid);

            const fetchMeetingData = async () => {
                try {
                    const response = await fetch('/streaming/meeting/join', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ meetingId: mid, userId: uid }),
                    });

                    if (!response.ok) throw new Error('Erro ao buscar dados da reunião');

                    const data = await response.json();
                    setJoinData(data);
                } catch (error) {
                    
                    console.error('Erro ao buscar dados da reunião:', error);
                }
            };

            fetchMeetingData();
        }
    }, [mid, uid]);
    
    if (!meetingId || !userId) {
        return <Spinner texto="Carregando informações da reunião..." />;
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <MeetingProvider>
                {!inMeeting && joinData ? (
                    <MeetingForm
                        data={joinData}
                        meetingId={meetingId}
                        userId={userId}
                        onJoined={() => setInMeeting(true)}
                    />
                ) : inMeeting ? (
                    <Meeting />
                ) : (
                    <Spinner texto="Iniciando consulta..." />
                )}
            </MeetingProvider>
        </ThemeProvider>
    );
}
