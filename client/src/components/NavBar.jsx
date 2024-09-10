import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../firebaseConfig";
import '../index.css';

const NavBar = () => {
  const [userName, setUserName] = useState(null);
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserName(user.displayName);
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
    <nav>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {userName ? (
              <div className="flex items-center space-x-4"> {/* Adjusted spacing here */}
                <p className="text-gray-900 dark:text-white">Welcome, {userName}</p>
                <button className="btn btn-primary" onClick={sign_out}>Sign Out</button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={sign_in}>Login</button>
            )}
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link to='/' className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 dark:text-white">Home</Link>
              </li>
              <li>
                <Link to='/game' className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 dark:text-white">Play</Link>
              </li>
              <li>
                <Link to='/store' className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 dark:text-white">Store</Link>
              </li>
              <li>
                <Link to='/leaderboard' className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 dark:text-white">Leaderboard</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </nav>
  );
};

export default NavBar;
