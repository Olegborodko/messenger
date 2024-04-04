import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div>
      <h1>Страница "О нас"</h1>
      <Link to="/">Вернуться на главную страницу</Link>
    </div>
  );
}

export default AboutPage;