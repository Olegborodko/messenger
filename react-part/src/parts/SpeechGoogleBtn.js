import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import RecordRTC from 'recordrtc';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SpeechGoogleBtn = ({ onChangeTranscription }) => {
  const [recorder, setRecorder] = useState(null);
  const activityTimerRef = useRef(null);
  const [sampleRateHertz, setSampleRateHertz] = useState(null);

  const sendRequest = async (file) => {
    const formData = new FormData();
    formData.append('audio', file, 'recording.wav');
    formData.append('sampleRateHertz', sampleRateHertz);

    try {
      const response = await axios.post(backendUrl + '/google-speech', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response && response.status === 200) {
        onChangeTranscription(response.data.result);
      } else {
        console.error('Error uploading audio');
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  }

  const stopRecordingWithoutRequest = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        if (recorder && recorder.stream) {
          recorder.stream.stop();
        }

        if (recorder && recorder.stream) {
          recorder.stream.getTracks().forEach(track => {
            track.stop();
          });
        }
      });
    }

    setRecorder(null);
    clearInterval(activityTimerRef.current);
  }

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        // const audioUrl = URL.createObjectURL(blob);

        if (recorder && recorder.stream) {
          recorder.stream.stop();
        }

        if (recorder && recorder.stream) {
          recorder.stream.getTracks().forEach(track => {
            track.stop();
          });
        }

        sendRequest(blob);
      });

      setRecorder(null);
      clearInterval(activityTimerRef.current);
    }
  };

  const startRecording = async () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const sampleRate = audioContext.sampleRate;
        setSampleRateHertz(sampleRate);

        const options = {
          type: 'audio',
          mimeType: 'audio/wav',
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1
        };
        const record = RecordRTC(stream, options);
        record.startRecording();
        setRecorder(record);

        activityTimerRef.current = setInterval(() => {
          console.log('stopRecordingWithoutRequest');
          stopRecordingWithoutRequest();
        }, 30000);
      })
      .catch(error => console.error('getUserMedia error:', error));
  };

  return (
    <div>
      {recorder ? (
        <Button onClick={stopRecording}>
          Stop recording
        </Button>
      ) : (
        <Button onClick={startRecording}>
          Start Recording
        </Button>
      )}
    </div>
  );
}

export default SpeechGoogleBtn;
