import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import EmailModal from './parts/EmailModal';
import Button from 'react-bootstrap/Button';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const HomePage = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });

  useEffect(() => {
    // axios.get(backendUrl + "/messages")
    //   .then(response => {
    //     console.log(response.data);
    //     setData(response.data);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const socket = socketIOClient(backendUrl);

    socket.on('messages', data => {
      setData(data);
    });

    return () => {
      socket.off('messages');
      socket.disconnect();
    }
  }, []);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (idEmail) => {
    setFormData({ ...formData, subject: '', message: '', idEmail });
    setShowModal(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
              {el.idEmail} | {el.date}
            </div>
            <div>
              {el.from} | {el.subject}
            </div>
            <div>
              {el.body}
            </div>
            <div>
              <Button variant="primary" onClick={() => handleShowModal(el.idEmail)}>
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
      />
    </div>
  );
}

export default HomePage;