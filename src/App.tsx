import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './Components/Home'
import Preferiti from './Components/Preferiti'
import MovieDetails from './Components/MovieDetail'
import Sidebar from './Components/Sidebar'
import { FavoritesProvider } from './Context/FavoritesContext'
import { FiMenu } from 'react-icons/fi'

const App = () => {
  const [menuVisible, setMenuVisible] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const navigate = useNavigate()

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handleChange = () => setMenuVisible(mq.matches)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [])

  return (
    <FavoritesProvider>
      <div className="flex min-h-screen w-full">
        {menuVisible && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMenuVisible(false)}
            ></div>

            <div className="fixed z-50 md:static top-0 left-0 h-full w-72 bg-gray-800 text-white">
              <Sidebar setSidebarOpen={setMenuVisible} />
            </div>
          </>
        )}

        <div className="flex-1 p-6 bg-gray-100">
          {!menuVisible && (
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => setMenuVisible(true)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded shadow hover:bg-gray-200"
              >
                <FiMenu className="text-2xl text-gray-800" />
              </button>
              <h1
                onClick={() => navigate('/')}
                className="text-2xl font-bold text-gray-900 cursor-pointer"
              >
                CineFlix
              </h1>
            </div>
          )}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/preferiti" element={<Preferiti />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
          </Routes>
        </div>
      </div>
    </FavoritesProvider>
  )
}

export default App
