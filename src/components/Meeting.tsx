import { FC, useEffect } from 'react';
import {
  AudioInputControl,
  AudioOutputControl,
  ControlBar,
  ControlBarButton,
  Phone,
  useMeetingManager,
  MeetingStatus,
  useMeetingStatus,
  VideoInputControl,
  VideoTileGrid
} from 'amazon-chime-sdk-component-library-react';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

const Meeting: FC = () => {
  const navigate = useNavigate();
  const meetingManager = useMeetingManager();
  const meetingStatus = useMeetingStatus();

  useEffect(() => {
    if (meetingStatus !== MeetingStatus.Succeeded) return;

    const handlePopState = (event: PopStateEvent) => {
      const confirmLeave = window.confirm('Você está numa reunião. Deseja realmente sair? Use o botão "End" para sair.');
      if (!confirmLeave) {
        // Impede voltar ao adicionar novamente ao histórico
        window.history.pushState(null, '', window.location.pathname);
      } else {
        // Se confirmar, faz o leave e navega para home
        meetingManager.leave().then(() => navigate('/home'));
      }
    };

    // Adiciona um estado ao histórico para controlar o voltar
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [meetingManager, meetingStatus, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (meetingStatus === MeetingStatus.Succeeded) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [meetingStatus]);

  const clickedEndMeeting = async () => {
    const meetingId = meetingManager.meetingId;
    if (meetingId) {
      await meetingManager.leave();
      navigate('/home');
    }
  };

  useEffect(() => {
    const startDevices = async () => {
      if (meetingStatus !== MeetingStatus.Succeeded) {
        return;
      }

      try {
        // 1) Solicita permissão para áudio e vídeo ao mesmo tempo
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        // Interrompe imediatamente as tracks, pois só precisamos da permissão
        stream.getTracks().forEach((track) => track.stop());

        // 2) Lista todos os dispositivos disponíveis
        const allDevices = await navigator.mediaDevices.enumerateDevices();

        // 3) Filtra câmeras (videoinput) e aciona a primeira encontrada
        const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
        if (videoDevices.length > 0) {
          await meetingManager.startVideoInputDevice(videoDevices[0].deviceId);
        } else {
          console.warn('Nenhuma câmera (videoinput) encontrada.');
        }

        // 4) Filtra microfones (audioinput) e escolhe aquele associado ao stream,
        //    ou o primeiro da lista caso não encontre correspondência
        const audioDevices = allDevices.filter(d => d.kind === 'audioinput');
        if (audioDevices.length > 0) {
          // Tenta usar o mesmo microfone que deu permissão no getUserMedia
          const audioTrack = stream.getAudioTracks()[0];
          let selectedAudioDevice: MediaDeviceInfo | undefined;
          if (audioTrack) {
            const trackSettings = audioTrack.getSettings();
            selectedAudioDevice = audioDevices.find(d => d.deviceId === trackSettings.deviceId);
          }
          // Se não achou, pega o primeiro disponível
          if (!selectedAudioDevice) {
            selectedAudioDevice = audioDevices[0];
          }
          await meetingManager.startAudioInputDevice(selectedAudioDevice.deviceId);
        } else {
          console.warn('Nenhum microfone (audioinput) encontrado.');
        }
      } catch (err) {
        console.error('Erro ao iniciar câmera e/ou microfone:', err);
      }
    };

    startDevices();
  }, [meetingStatus, meetingManager]);

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      {meetingStatus === MeetingStatus.Succeeded ? (
        <>
          <div style={{ flex: 1, width: '100%' }}>
            <VideoTileGrid />
          </div>
          <ControlBar layout="undocked-horizontal" showLabels>
            <AudioInputControl />
            <VideoInputControl />
            <AudioOutputControl />
            <ControlBarButton icon={<Phone />} onClick={clickedEndMeeting} label="Sair" />
          </ControlBar>
        </>
      ) : (
        <Spinner texto="Conectando vídeo..." />
      )}
    </div>
  );
};

export default Meeting;
