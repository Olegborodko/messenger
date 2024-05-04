import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthorizationPage = () => {
  const [user, setUser] = useState({});
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleInitialize = (response) => {
    let userObj = jwtDecode(response.credential);
    setUser(userObj);
  }

  // const checkUserLoggedIn = () => {
  //   if (!window.google) {
  //     return false;
  //   }
  //   window.google.accounts.id.revoke(
  //     null,
  //     (response) => {
  //       if (response.success) {
  //         setLoggedIn(false);
  //       } else {
  //         setLoggedIn(true);
  //         console.log('loggedIn');
  //       }
  //     }
  //   );
  // }

  const handleRevoke = () => {
    window.google.accounts.id.revoke('113116273633459248830', done => {
      console.log(done);
    });
  }

  const handleAccountInitialize = () => {
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleInitialize
    });
  }

  const handleShowBtn = () => {
    // window.onGoogleLibraryLoad = () => {
      // window.google.accounts.id.initialize({
      //   client_id: CLIENT_ID,
      //   callback: handleInitialize
      // });
      window.google.accounts.id.renderButton(
        document.getElementById("sigInDiv"),
        { theme: "outline", size: "large" }
      );
      window.google.accounts.id.prompt();
    //  };
  }

  useEffect(() => {
    // checkUserLoggedIn();
    // console.log(loggedIn);
    // window.google.accounts.id.disableAutoSelect();
    // window.google.accounts.id.cancel();



    // return () => {
    //   window.google.accounts.id.disableAutoSelect();
    // }
  }, []);

  return (
    <div>
      <div id="sigInDiv"></div>
      <div onClick={handleAccountInitialize}>handleAccountInitialize</div>
      <div onClick={handleRevoke}>handleRevoke</div>
      <div onClick={handleShowBtn}>handleShowBtn</div>
    </div>
  );
}

export default AuthorizationPage;