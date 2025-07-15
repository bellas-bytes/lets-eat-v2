import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="navbar bg-base-100 shadow-sm">
    <div className="navbar-start">
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
      </div>
      <Link to="#" className="btn btn-ghost text-xl">daisyUI</Link>
    </div>
    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal px-1">
        <li><Link to="#">Item 1</Link></li>
        <li>
          <details>
            <summary>Parent</summary>
            <ul className="p-2">
              <li><Link to="#">Submenu 1</Link></li>
              <li><Link to="#">Submenu 2</Link></li>
            </ul>
          </details>
        </li>
        <li><Link to="#">Item 3</Link></li>
      </ul>
    </div>
    <div className="navbar-end">
      <Link to="#" className="btn">Button</Link>
    </div>
  </div>
);

export default Navbar;
