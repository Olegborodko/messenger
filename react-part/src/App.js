import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import Page404 from './Page404';
import AuthorizationPage from './AuthorizationPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<AuthorizationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/main" element={<HomePage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
