import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { useHistory, NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './Navigation.css'


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout()).then(() => {
      history.push('/')
  });
  }
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <>
    <div className="profile-btn-container">
      <button  onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      </div>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.email}</li>
            <li>
            <button onClick={() => history.push('/')}><img src="https://storage.cloud.google.com/graphit_bucket/home_25694.png" alt="Graph Icon" style={{width: "30px", height: "30px"}} /> home</button>
          </li>
          
          <li>
            <button onClick={() => history.push('/graph')}> <img src="https://storage.cloud.google.com/graphit_bucket/stats_182687.png" alt="Graph Icon" style={{width: "30px", height: "30px"}} /> graphs</button>
          </li>
            <li>
              <button onClick={handleLogout}><img src="https://storage.cloud.google.com/graphit_bucket/logout_1828427.png" alt="Graph Icon" style={{width: "40px", height: "30px"}} /> Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
