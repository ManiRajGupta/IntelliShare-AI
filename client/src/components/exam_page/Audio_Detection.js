import React, { useEffect } from 'react';

const VoiceDetectionComponent = ({ stopAfter }) => {
    let isVoiceHeard = false;

    useEffect(() => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();

        const startListening = () => {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const microphone = audioContext.createMediaStreamSource(stream);

                    const scriptNode = audioContext.createScriptProcessor(2048, 1, 1);

                    microphone.connect(scriptNode);
                    scriptNode.connect(audioContext.destination);

                    scriptNode.onaudioprocess = (event) => {
                        const inputData = event.inputBuffer.getChannelData(0);
                        let sum = 0;

                        for (let i = 0; i < inputData.length; i++) {
                            sum += Math.abs(inputData[i]);
                        }
                        const avg = sum / inputData.length;

                        const threshold = 0.1;

                        if (avg > threshold) {
                            isVoiceHeard = true;
                            console.log('Voice heard');
                        } else {
                            isVoiceHeard = false;
                        }
                    };

                    setTimeout(() => {
                        stopListening();
                    }, stopAfter * 1000);
                })
                .catch((err) => {
                    console.error('Error accessing microphone:', err);
                });
        };

        const stopListening = () => {
            audioContext.close().then(() => {
                console.log('Audio context closed');
            });
        };

        startListening();

        return () => {
            stopListening();
        };
    }, [stopAfter]);

    return (
        <div>
            {/* Component JSX */}
        </div>
    );
};

export default VoiceDetectionComponent;
