// Этот код будет работать только на локальном компьютере
// когда зальешь его на сервер, там нет микрофона, и ничего
// работать не будет.

require('dotenv').config();
const recorder = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');

const client = new speech.SpeechClient();

// Define the required parameters
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US'; //'ru-Ru' en-US

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};

let recognizeStream;
let recordingStream;
let resultRecording;
let recordingTimer;

async function startRecording() {
  resultRecording = "";
  recognizeStream = false;
  recordingStream = false;
  clearTimeout(recordingTimer);
  recordingTimer = null;

  recognizeStream = client
    .streamingRecognize(request)
    .on('error', () => {
      stopRecording();
    })
    .on('data', data => {
      if (data.results && data.results[0] && data.results[0].alternatives && data.results[0].alternatives[0]) {
        resultRecording = resultRecording + `${data.results[0].alternatives[0].transcript}`;
        // console.log(`Transcription: ${data.results[0].alternatives[0].transcript}`);
      } else {
        console.log('\n\nReached transcription time limit, press Ctrl+C\n');
      }
    });

  recordingStream = recorder
    .record({
      sampleRateHertz: sampleRateHertz,
      threshold: 0,
      verbose: false,
      recordProgram: 'rec',
      silence: '10.0',
    })
    .stream()
    .on('error', console.error)
    .pipe(recognizeStream);

  recordingTimer = setTimeout(stopRecording, 30000);
}

async function stopRecording() {
  return new Promise((resolve) => {
    if (recordingTimer) {
      clearTimeout(recordingTimer);
      recordingTimer = null;
    }
  
    // Close the recognize stream
    if (recognizeStream) {
      recognizeStream.end();
    }
  
    // Stop recording stream
    if (recordingStream) {
      recordingStream.end();
      console.log('Recording stopped.');
    }

    recordingStream.on('end', () => {
      resolve(resultRecording);
    });
  });
}

// function delay(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

module.exports = { startRecording, stopRecording };
