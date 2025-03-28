import React, { useEffect, useRef, useState } from 'react';
import { Room, createLocalVideoTrack } from 'livekit-client';

const VideoRoom = ({ user }) => {
    const [room, setRoom] = useState(null);
    const [error, setError] = useState(null);
    const localVideoRef = useRef(null);
    const remoteVideosRef = useRef(null);

    useEffect(() => {
        console.log('🔹 Received user in VideoRoom:', user);
        if (!user || !user.name) {
            setError('User information is missing');
            return;
        }

        const joinRoom = async () => {
            try {
                const res = await fetch(
                    'https://backendvideocall-1.onrender.com/join-room',
                    //'http://localhost:5000/join-room',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            room: 'my-room',
                            name: user.name
                        })
                    }
                );

                if (!res.ok)
                    throw new Error(`Failed to fetch token: ${res.statusText}`);

                const { token } = await res.json();

                const roomInstance = new Room();
                await roomInstance.connect(
                    'wss://firtslive-5eitg5gp.livekit.cloud',
                    token
                );
                setRoom(roomInstance);

                const localVideoTrack = await createLocalVideoTrack();
                localVideoTrack.attach(localVideoRef.current);
                await roomInstance.localParticipant.publishTrack(
                    localVideoTrack
                );

                const handleTrackSubscribed = (
                    track,
                    publication,
                    participant
                ) => {
                    if (track.kind === 'video') {
                        const videoElement = document.createElement('video');
                        videoElement.autoplay = true;
                        videoElement.playsInline = true;
                        videoElement.className = 'img-thumbnail mb-2';
                        videoElement.style.width = '300px';
                        track.attach(videoElement);
                        if (remoteVideosRef.current) {
                            remoteVideosRef.current.appendChild(videoElement);
                        }
                    }
                };

                roomInstance.on('participantConnected', (participant) => {
                    participant.on('trackSubscribed', handleTrackSubscribed);
                });

                // 🔥 FIX lỗi `undefined` khi `participants` chưa khởi tạo
                if (
                    roomInstance.participants &&
                    roomInstance.participants.size > 0
                ) {
                    roomInstance.participants.forEach((participant) => {
                        participant.on(
                            'trackSubscribed',
                            handleTrackSubscribed
                        );
                    });
                }
            } catch (err) {
                console.error('Error joining room:', err);
                setError(
                    `Lỗi kết nối: ${err.message || 'Không thể tham gia phòng'}`
                );
            }
        };

        joinRoom();

        return () => {
            if (room) {
                room.disconnect();
            }
        };
    }, [user]);

    return (
        <div className='container mt-4'>
            <h3 className='text-center mb-4'>🎥 Video Call Room</h3>
            {error && <p className='alert alert-danger text-center'>{error}</p>}

            <div className='row justify-content-center'>
                {/* Local Video */}
                <div className='col-md-4 d-flex flex-column align-items-center'>
                    <h5 className='text-center'>{user?.name}</h5>
                    <div className='video-wrapper'>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className='video-local'
                        />
                        <div className='name-tag'>{user?.name}</div>
                    </div>
                </div>

                {/* Remote Videos */}
                <div className='col-md-8'>
                    <h5 className='text-center'>Remote Participants</h5>
                    <div
                        ref={remoteVideosRef}
                        className='d-flex flex-wrap justify-content-center gap-3 video-container'
                    >
                        {/* Remote video elements will be appended here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoRoom;
