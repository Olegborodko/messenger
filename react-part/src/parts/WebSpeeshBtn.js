import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

const WebSpeeshBtn = ({ onChangeTranscription }) => {
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [, setTranscription] = useState('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const newRecognition = new window.webkitSpeechRecognition();
      newRecognition.lang = process.env.REACT_APP_WEBSPEECH_LANG;
      newRecognition.continuous = true;
      newRecognition.interimResults = false;

      newRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleTranscription(transcript);
      };

      newRecognition.onend = () => {
        if (isRecording) {
          newRecognition.start();
        }
      };

      setRecognition(newRecognition);
    } else {
      console.error('Ваш браузер не поддерживает Web Speech API.');
    }
  }, []);

  const handleTranscription = (transcript) => {
    setTranscription(transcript);
    onChangeTranscription(transcript);
  }

  const handleButtonClick = () => {
    if (recognition) {
      if (isRecording) {
        // Если запись идет, остановите запись
        recognition.stop();
      } else {
        // Если запись не идет, начните запись
        recognition.start();
      }
      setIsRecording(!isRecording);
    }
  };

  return (
    <Button variant="secondary" onClick={handleButtonClick}>
      {isRecording ? "Stop record" : "Record message"}
    </Button>
  );
}

export default WebSpeeshBtn;
