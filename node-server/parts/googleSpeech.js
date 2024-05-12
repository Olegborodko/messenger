const speech = require('@google-cloud/speech');
const speechClient = new speech.SpeechClient();
const player = require('play-sound')();
const fs = require('fs');

function recognizeSpeech(audio, config) {
  return new Promise((resolve, reject) => {
    speechClient.recognize({ audio, config }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

async function googleGetTranscription(filePath) {
  try {
    const file = fs.readFileSync(filePath);

    const audio = {
      content: file.toString('base64')
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 44100,
      languageCode: 'en-US'  //'en-US', //
    };

    const response = await recognizeSpeech(audio, config);

    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');

    return transcription;
  } catch (error) {
    console.error('Error processing audio file:', error);
    return false;
  }
}

module.exports = { googleGetTranscription };