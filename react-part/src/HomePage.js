import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

const HomePage = () => {
  const [data, setData] = useState([]);

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

    return () => socket.disconnect();
  }, []);

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
          </div>
        )
      })}
    </div>
  );
}

export default HomePage;