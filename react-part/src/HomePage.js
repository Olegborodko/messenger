import React, { useState } from 'react';
import axios from 'axios';
import EmailModal from './parts/EmailModal';
import Button from 'react-bootstrap/Button';
import socket from './parts/Socket';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const HomePage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });

  socket.on('messages', data => {
    setData(data);
  });

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (el) => {
    setFormData({ ...formData, subject: '', message: '', idEmail: el.idEmail, emailTo: el.email });
    setShowModal(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTranscription = (data) => {
    setFormData({ ...formData, message: data });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('formData ', formData);

      const response = await axios.post(backendUrl + '/send-email', { formData });
      console.log(response);
    } catch (error) {
      console.error('Error after form send ', error);
    }
    handleCloseModal();
  };

  return (
    <div>
      {data.map(function (el) {
        return (
          <div className='email-block' key={el._id}>
            <div>
              {el.idEmail} | {el.email} | {el.date}
            </div>
            <div>
              {el.name} | {el.subject}
            </div>
            <div>
              {el.body}
            </div>
            <div>
              <Button variant="primary" onClick={() => handleShowModal(el)}>
                Answer
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
      />
    </div>
  );
}

export default HomePage;