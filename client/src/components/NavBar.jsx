import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../firebaseConfig";
import '../index.css';

const NavBar = ({setUser}) => {
  const [userName, setUserName] = useState(null);
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const displayName = user.displayName;
            const uid = user.uid;
            console.log(uid);
            console.log(displayName);
            setUserName(user.displayName);
            setUser(user.displayName);
          } else {
            setUserName(null); 
          }
        });
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  }, [auth]);

  const sign_in = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUserName(user.displayName);
        console.log(userName);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  };

  const sign_out = () => {
    signOut(auth)
      .then(() => {
        setUserName(null);
      })
      .catch((error) => {
        console.error("Error during sign-out:", error);
      });
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center md:order-2">
          {userName ? (
            <div className="flex items-center space-x-4">
              <p className="text-gray-900 dark:text-white">Welcome, {userName}</p>
              <button className="btn btn-primary" onClick={sign_out}>Sign Out</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={sign_in}>Login</button>
          )}
        </div>

        <div className="relative md:hidden flex items-center">
          <button className="btn btn-primary" type="button" data-drawer-toggle="default-sidebar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg md:space-x-8 md:flex-row md:mt-0 md:border-0">
            <li>
              <Link to='/' className="block py-2 px-3 text-gray-900 rounded hover:text-primary dark:text-white">Home</Link>
            </li>
            <li>
              <Link to='/game' className="block py-2 px-3 text-gray-900 rounded hover:text-primary dark:text-white">Play</Link>
            </li>
            <li>
              <Link to='/leaderboard' className="block py-2 px-3 text-gray-900 rounded hover:text-primary dark:text-white">Leaderboard</Link>
            </li>
          </ul>
        </div>
      </div>

      <div id="default-sidebar" className="fixed top-0 left-0 w-64 h-screen transition-transform -translate-x-full md:hidden">
        <div className="bg-white border-gray-200 dark:bg-gray-900 h-full p-4">
          <button type="button" data-drawer-dismiss="default-sidebar" aria-controls="default-sidebar" aria-expanded="false">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <ul className="flex flex-col font-medium p-4 mt-4 rounded-lg">
            <li>
              <Link to='/' className="block py-2 px-3 text-gray-900 rounded hover:text-primary dark:text-white">Home</Link>
            </li>
            <li>
              <Link to='/game' className="block py-2 px-3 text-gray-900 rounded hover:text-primary dark:text-white">Play</Link>
            </li>
            <li>
              <Link to='/leaderboard' className="block py-2 px-3 text-gray-900 rounded hover:text-primary dark:text-white">Leaderboard</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
