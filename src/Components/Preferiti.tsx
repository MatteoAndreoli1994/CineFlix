import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../Context/FavoritesContext'
import MovieCard from './MovieCard'
import { FaSpinner, FaStar } from 'react-icons/fa'

interface MovieSummary {
  imdbID: string
  Title: string
  Year: string
  Poster: string
}

const Preferiti = () => {
  const navigate = useNavigate()
  const { favorites } = useFavorites()
  const [favoriteMovies, setFavoriteMovies] = useState<MovieSummary[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteMovies([])
      return
    }

    const fetchFavoriteMovies = async () => {
      setLoading(true)
      const data: MovieSummary[] = []

      try {
        for (const id of favorites) {
          const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=8a6c3486`)
          const json = await res.json()
          if (json.Response === 'True') {
            data.push({
              imdbID: json.imdbID,
              Title: json.Title,
              Year: json.Year,
              Poster: json.Poster
            })
          }
        }
        setFavoriteMovies(data)
      } catch (err) {
        console.error('Errore caricamento preferiti', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFavoriteMovies()
  }, [favorites])

  const handleMovieClick = (id: string) => {
    navigate(`/movie/${id}`)
  }

  return (
    <div className="p-4 min-h-screen bg-transparent">
      <h1 className="text-3xl font-semibold text-center mb-8">
        I tuoi Film Preferiti
      </h1>

      {loading && (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
        </div>
      )}

      {!loading && favoriteMovies.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favoriteMovies.map(movie => (
            <MovieCard
              key={movie.imdbID}
              imdbID={movie.imdbID}
              title={movie.Title}
              year={movie.Year}
              poster={movie.Poster}
              onClick={handleMovieClick}
            />
          ))}
        </div>
      )}

      {!loading && favoriteMovies.length === 0 && (
        <div className="text-center mt-20">
          <FaStar className="text-5xl text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            Nessun film nei preferiti.
          </p>
        </div>
      )}
    </div>
  )
}

export default Preferiti
