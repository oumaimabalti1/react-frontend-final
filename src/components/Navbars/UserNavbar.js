import React from "react";
import logo from "assets/img/EASYRH.png";

export default function UserNavbar() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 flex flex-wrap items-center justify-between px-1 py-2 bg-navy h-20">
        <div className="w-full relative flex justify-between lg:w-auto px-4 lg:static lg:block lg:justify-start">
          <a href="/" className="inline-block mr-4 py-2 whitespace-no-wrap">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </a>

          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
          >
            <span className="block relative w-6 h-px rounded-sm bg-white"></span>
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1"></span>
          </button>
        </div>

        <div className="lg:flex flex-grow items-center">
          <ul className="flex flex-col lg:flex-row list-none mr-auto">
            <li className="nav-item">
              <a className="px-3 py-2 flex items-center text-xs uppercase font-bold text-white hover:opacity-75">
                Why us?
              </a>
            </li>
            <li className="nav-item">
              <a className="px-3 py-2 flex items-center text-xs uppercase font-bold text-white hover:opacity-75">
                Contact us
              </a>
            </li>
            <li className="nav-item">
              <a className="px-3 py-2 flex items-center text-xs uppercase font-bold text-white hover:opacity-75">
                About
              </a>
            </li>
          </ul>

        </div>
      </nav>

      <div className="h-20" />
    </>
  );
}