import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios';

const HomePage = () => {
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   axios.get('https://api.example.com/data')
  //     .then(response => {
  //       // Обработка полученных данных
  //       setData(response.data);
  //     })
  //     .catch(error => {
  //       // Обработка ошибок
  //       console.error('Ошибка при выполнении GET-запроса:', error);
  //     });
  // }, []);

  return (
    <div>
      <h1>Главная страница</h1>
      <Link to="/about">Перейти на страницу "О нас"</Link>
    </div>
  );
}

export default HomePage;