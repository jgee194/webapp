import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import Logout from './Logout';

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  margin-top: 0px;
  line-height: 3;
  padding-right: 30px;
  .nav-link, a {
    margin: 20px 0px 20px 0px;
    text-decoration: none;
    color: white;
  }
  
  z-index: 10;
  flex-flow: column nowrap;
  background-color: #89C7B9;
  position: fixed;
  transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
  top: 0;
  right: 0;
  height: 100vh;
  width: 300px;
  padding-top: 3.5rem;
  transition: transform 0.3s ease-in-out;
  @media (orientation: portrait) {
    width: 200px;
  }
`;

const Navbar = ({ open }) => {
  return (
    <div>
      <Ul open={open}>
        <Link className="nav-link" to="/account">會員中心</Link>
        <Link className="nav-link" to="/shop">商店</Link>
        <Link className="nav-link" to="/history">歷史紀錄</Link>
        <Link className="nav-link" to="/settings">設定</Link>
        <Link className="nav-link" to="/help">幫助中心</Link>
        <Logout />
      </Ul>
    </div>
  )
}

export default Navbar