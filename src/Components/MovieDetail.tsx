import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { FaSpinner, FaStar } from 'react-icons/fa'


interface MovieDetailsResponse {
  Title: string
  Year: string
  Genre: string
  Director: string
  Actors: string
  Plot: string
  Poster: string
  Ratings: { Source: string; Value: string }[]
  Response: string
  Error?: string
}


const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()
  const [movie, setMovie] = useState<MovieDetailsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userRating, setUserRating] = useState<number>(0)

  useEffect(() => {
    if (!id) return

    const savedRating = localStorage.getItem(`rating-${id}`)
 


    if (savedRating) {
      setUserRating(parseInt(savedRating))
    }

    const fetchMovieDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`http://www.omdbapi.com/?i=${encodeURIComponent(id)}&apikey=8a6c3486&plot=full`)
        const data: MovieDetailsResponse = await res.json()
        if (data.Response === 'True' ) {
          setMovie(data)
        } else {
          setError(data.Error || 'Errore')
        }
      } catch {
        setError('Errore nel fetch')
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])


  const handleRating = (value: number) => {
    setUserRating(value)

  if (id) {

    localStorage.setItem(`rating-${id}`, value.toString())
  }
  }



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">

        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
    <div className="p-6 text-center text-red-600">

    {error}
    </div>
    )
  }

  return (
  <div className="p-6 bg-gray-100 min-h-screen">
    <button onClick={() => navigate(-1)} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
        <FiArrowLeft />
        <span>Torna Indietro</span>
    </button>

      {movie && (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
          {movie.Poster && movie.Poster !== 'N/A' && (
            <img
              src={movie.Poster}
              alt={`Poster di ${movie.Title}`}
              className="h-64 w-full object-cover md:h-auto md:w-64"
            />
            )}

            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {movie.Title} 
                ({movie.Year})
              </h1>

              <div className="flex items-center mb-4">

                {[1, 2, 3, 4, 5].map((n) => (

                  <FaStar
                  key={n}
                  onClick={() => handleRating(n)}
                  className={`cursor-pointer text-2xl transition-colors ${
                    n <= userRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  />
                ))}

              </div>

                <p className="text-gray-700"><strong>Genere:</strong> {movie.Genre}</p>
                <p className="text-gray-700"><strong>Regista:</strong> {movie.Director}</p>
                <p className="text-gray-700"><strong>Attori:</strong> {movie.Actors}</p>
                <p className="text-gray-700 mt-4"><strong>Trama:</strong> {movie.Plot}</p>


              {movie.Ratings && movie.Ratings.length > 0 && (
                <div className="mt-6">

                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Valutazioni</h2>
                  <ul className="list-disc pl-5 text-gray-700">

                    {movie.Ratings.map((r) => (
                      <li key={r.Source}>
                        {r.Source}: {r.Value}
                      </li>
                    ))}

                  </ul>

                </div>
              )}
              
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetails
