import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const OpenAiBtn = ({ data, handleOpenAiBtnClick }) => {

  const handleButtonClick = async () => {
    try {
      if (data) {
        const response = await axios.post(backendUrl + '/open-ai', { data });
        if (response && response.status === 200) {
          handleOpenAiBtnClick(response.data.result);
        }
      }
    } catch (error) {
      console.error('Error after form send ', error);
    }
  };

  return (
    <Button onClick={handleButtonClick}>
      Ai change text
    </Button>
  );
}

export default OpenAiBtn;
