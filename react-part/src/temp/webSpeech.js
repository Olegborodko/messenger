import React, { useState, useEffect } from 'react';

const SpeechRecognitionButton = () => {
    // Переменные состояния
    const [recognition, setRecognition] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');

    useEffect(() => {
        // Создание экземпляра распознавания речи при загрузке компонента
        if ('webkitSpeechRecognition' in window) {
            const newRecognition = new window.webkitSpeechRecognition();
            newRecognition.lang = 'ru-RU'; // Установите нужный язык
            newRecognition.interimResults = false; // Разрешает только конечные результаты

            // Обработчик результатов распознавания
            newRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setTranscription(transcript);
            };

            setRecognition(newRecognition);
        } else {
            console.error('Ваш браузер не поддерживает Web Speech API.');
        }
    }, []);

    // Обработчик нажатия на кнопку
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
        <div>
            <button onClick={handleButtonClick}>
                {isRecording ? 'Остановить запись' : 'Начать запись'}
            </button>
            <div>
                <h3>Транскрипция:</h3>
            </div>
        </div>
    );
};

export default SpeechRecognitionButton;
