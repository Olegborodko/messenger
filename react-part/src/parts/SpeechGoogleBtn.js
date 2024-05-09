import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SpeechGoogleBtn = ({ onChangeTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);

  const sendRequest = async () => {
    const response = await axios.post(backendUrl + '/google-speech', { isRecording: String(isRecording) });
    if (response && response.status === 200) {
      onChangeTranscription(response.data.result);
      setIsRecording(!isRecording);
      return true;
    } else {
      return false;
    }
  }

  const toggleRecording = async () => {
    try {
      if (!isRecording) {
        await sendRequest();
      }

      if (isRecording) {
        // return result;
        await sendRequest();
      }
    } catch (error) {
      console.error('Error ', error);
    }
  }

  return (
    <div>
      <Button onClick={toggleRecording}>
        {isRecording ? 'Stop recording' : 'Start recording'}
      </Button>
    </div>
  );
}

export default SpeechGoogleBtn;
