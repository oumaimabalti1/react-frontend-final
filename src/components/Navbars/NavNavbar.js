import React from "react";
import logo from "assets/img/EASYRH.png";

export default function NavNavbar() {
  return (
    <nav className="relative flex flex-wrap items-center justify-between px-1 py-2 navbar-expand-lg bg-navy rounded mb-3">
      <div className="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">
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
            <a
              className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
              href="#pablo"
            >
              <span className="ml-2">Why us?</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
              href="#pablo"
            >
              <span className="ml-2">Contact us</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
              href="#pablo"
            >
              <span className="ml-2">About</span>
            </a>
          </li>
        </ul>

        <div className="relative flex w-full sm:w-7/12 md:w-5/12 px-4 flex-wrap items-stretch lg:ml-auto">
          <div className="flex">
            <li className="nav-item">
              <button
                className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                Contact Sales
              </button>
              <button
                className="bg-blueGray-200 text-navy active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded-full shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                Request a demo
              </button>
            </li>
          </div>
        </div>
      </div>
    </nav>
  );
}
