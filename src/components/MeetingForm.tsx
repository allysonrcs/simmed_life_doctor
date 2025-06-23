import { FC, useEffect } from 'react';
import { DeviceLabels, useMeetingManager } from 'amazon-chime-sdk-component-library-react';
import MeetingSessionConfiguration from 'amazon-chime-sdk-js/build/meetingsession/MeetingSessionConfiguration';

interface Props {
    data: JoinInfo | null;
    meetingId: string;
    userId: string;
    onJoined?: () => void;
}

interface JoinInfo {
    meeting: any;
    attendee: any;
}

const MeetingForm: FC<Props> = ({ data, meetingId, userId, onJoined }) => {
    const meetingManager = useMeetingManager();

    useEffect(() => {
        const join = async () => {

            try {
                if (!meetingId || !userId) {
                    throw new Error('Meeting ID and User ID are required');
                }

                if (!data) {
                    throw new Error('Invalid join info');
                }

                const joinInfo: JoinInfo = data;

                if (!joinInfo.meeting || !joinInfo.attendee?.attendeeId) {
                    throw new Error('Invalid join info');                    
                }

                const config = new MeetingSessionConfiguration(joinInfo.meeting, joinInfo.attendee);

                await meetingManager.join(config, { deviceLabels: DeviceLabels.AudioAndVideo });
                await meetingManager.start();

                onJoined?.();                
            } catch (err) {
                console.error('Meeting join error:', err);                
            }
        };

        join();
    }, [meetingId, userId]);

    return null;
}

export default MeetingForm;
