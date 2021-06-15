import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

import '../components/navbar.css';

const StyledBurger = styled.div `
  width: 2rem;
  height: 2rem;
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 20;
  display: none;
  @media (max-width: 1600px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }
  div {
    width: 2rem;
    height: 0.25rem;
    background-color: ${({ open }) => open ? '#ccc' : '#333'};
    border-radius: 10px;
    transform-origin: 1px;
    transition: all 0.3s linear;
    &:nth-child(1) {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }
    &:nth-child(2) {
      transform: ${({ open }) => open ? 'translateX(100%)' : 'translateX(0)'};
      opacity: ${({ open }) => open ? 0 : 1};
    }
    &:nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`;

const Burger = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <div className="nav-modal" onClick={(e)=> {
        const modal = document.getElementsByClassName('nav-modal')[0];
        if (e.target === modal) {
          modal.style.display = 'none';
          setOpen(!open);
        }
      }}>
      </div>
      <StyledBurger open={open} onClick={() => {
        const modal = document.getElementsByClassName('nav-modal')[0];
        setOpen(!open);
        if (!open) {
          modal.style.display = 'block';
        } else {
          modal.style.display = 'none';
        }
      }}>
        <div />
        <div />
        <div />
      </StyledBurger>
      <Navbar open={open}/>
    </div>
  )
}
export default Burger;