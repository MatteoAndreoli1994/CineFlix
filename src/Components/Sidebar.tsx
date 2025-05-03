import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiX, FiSearch, FiHome, FiHeart, FiFilm } from 'react-icons/fi'

interface SidebarProps {
  setSidebarOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ setSidebarOpen }) => {
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()

  const searchStuff = () => {
    let trimmedQuery = searchText.trim()
    if (trimmedQuery !== '') {
      navigate(`/?q=${encodeURIComponent(trimmedQuery)}`)
      setSearchText('')
      if (window.innerWidth < 768) setSidebarOpen(false)
    }
  }

  const navClickHandler = () => {
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  return (
    <div className="fixed top-0 left-0 h-screen w-80 bg-gray-800 text-blue p-4 flex flex-col z-50">

      <div className="mb-6 flex justify-between items-center">

        <div className="flex items-center gap-2 text-white text-3xl font-bold">

          <FiFilm />
          CineFlix
        </div>

        <button onClick={() => setSidebarOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded shadow hover:bg-gray-200 lg:hidden">
          <FiX className="text-2xl text-gray-800" />
        </button>
      </div>

      <div className="mb-6 flex w-full">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Cerca film..."
          className="flex-grow px-3 py-2 bg-gray-700 text-gray-400 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchStuff}
          className="px-3 py-2 bg-blue-600 rounded-r hover:bg-blue-700 text-white"
        >
          <FiSearch />
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 text-white">
          <li>
            <NavLink
              to="/"
              end
              onClick={navClickHandler}
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 px-4 rounded ${isActive ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700'}`
              }
            >
              <FiHome />
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/preferiti"
              onClick={navClickHandler}
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 px-4 rounded ${isActive ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-700'}`
              }
            >
              <FiHeart />
              Preferiti
            </NavLink>
          </li>

        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
