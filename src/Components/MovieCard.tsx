import React from 'react'
import { useFavorites } from '../Context/FavoritesContext'
import { FaStar, FaRegStar } from 'react-icons/fa'

interface Props {
  imdbID: string
  title: string
  year: string
  poster: string
  onClick: (id: string) => void
}

const MovieCard: React.FC<Props> = ({ imdbID, title, year, poster, onClick }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const liked = favorites.includes(imdbID)

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (liked) {
      removeFavorite(imdbID)
    }else {
      addFavorite(imdbID)
    }

  }

  return (
    <div className="relative bg-white shadow-md rounded overflow-hidden cursor-pointer hover:shadow-lg transition-all" onClick={() => onClick(imdbID)}>
      <div className="absolute top-2 right-2 z-10" onClick={toggleFav}>

        {liked ? (
          <FaStar className="w-6 h-6 text-yellow-400" />
        ) : (
          <FaRegStar className="w-6 h-6 text-gray-400 hover:text-yellow-400" />
        )}

      </div>

      {poster ? (
          <img src={poster} alt={title} className="h-48 w-full object-cover" />
      ) : (
        <div className="h-48 w-full flex items-center justify-center bg-gray-200">
        </div>
      )}

      <div className="p-3">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{year}</p>
      </div>

    </div>
  )
}

export default MovieCard
