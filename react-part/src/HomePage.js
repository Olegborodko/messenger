import React, { useState } from 'react';
import axios from 'axios';
import EmailModal from './parts/EmailModal';
import Button from 'react-bootstrap/Button';
import socket from './parts/Socket';
import dayjs from 'dayjs';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const HomePage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [answerCarrent, setAnswerCurrent] = useState('');


  socket.on('messages', data => {
    setData(data);
  });

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (el) => {
    setFormData({ ...formData, subject: el.subject, message: '', idEmail: el.idEmail, fromEmail: el.fromEmail });
    setShowModal(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTranscription = (data) => {
    setFormData({ ...formData, message: data });
  }

  const handleOpenAiBtnClick = (data) => {
    setFormData({ ...formData, message: data });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + '/send-email', { formData });
      if (response && response.status === 200) {
        setAnswerCurrent(response.data.idEmail);
      } else {
        console.error('Error after form send ');
      }

    } catch (error) {
      console.error('Error after form send ', error);
    }
    handleCloseModal();
  };

  const formatDate = (dateString) => {
    const date = dayjs(dateString);
    const formattedDate = date.format('DD:MM:YYYY HH:mm:ss');

    return formattedDate;
  }

  return (
    <div className="home-page">
      {data.map(function (el) {
        return (
          <div className='email-block' key={el._id}>
            <div>
              <b>from:</b> <span className="ft-14">{el.fromEmail}</span> <b>date:</b> <span className="ft-14">{formatDate(el.date)}</span>
              {(el.answer && el.answer !== "") || answerCarrent === el.idEmail ? (<span className="success-letter">✓</span>) : ""}
            </div>
            <div>
              <b>name:</b> {el.fromName} <b>subject:</b> {el.subject}
            </div>
            <div>
              <b>text:</b> {el.body}
            </div>
            {el.answer !== "" && (<div>
              <b>answer:</b> {el.answer}
            </div>
            )}
            <div className='answer-btn-block'>
              <Button variant={(el.answer && el.answer !== "") || answerCarrent === el.idEmail ? "info" : "primary"} onClick={() => handleShowModal(el)}>
                {(el.answer && el.answer !== "") || answerCarrent === el.idEmail ? "Answer again" : "Answer"}
              </Button>
            </div>
          </div>
        )
      })}
      <EmailModal
        show={showModal}
        handleClose={handleCloseModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formData={formData}
        handleTranscription={handleTranscription}
        handleOpenAiBtnClick={handleOpenAiBtnClick}
      />
    </div>
  );
}

export default HomePage;