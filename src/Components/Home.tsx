import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import { FaSpinner } from 'react-icons/fa'

interface MoviePreview {
  imdbID: string,
  Title: string,
  Year: string,
  Poster: string
}

interface SearchResult {
  Search: MoviePreview[],
  totalResults: string,
  Response: string,
  Error?: string
}

const Home = () => {
  const loc = useLocation()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [results, setResults] = useState<MoviePreview[]>([])
  const [fetching, setFetching] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(loc.search)
    const rawQ = params.get('q') || ''
    setQ(rawQ)
  }, [loc.search])

  useEffect(() => {
    if (!q) {
      setResults([])
      setMsg(null)
      return
    }

    const getData = async () => {
      setFetching(true)
      setMsg(null)
      try {
        const r = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(q)}&apikey=8a6c3486`)
        const data: SearchResult = await r.json()
        if (data.Response === 'True') {
          setResults(data.Search)
        } else {
          setResults([])
          setMsg(data.Error || 'Errore sconosciuto')
        }
      } catch (e) {
        setResults([])
        setMsg('Errore di rete')
      } finally {
        setFetching(false)
      }
    }

    getData()
  }, [q])

  const goToDetail = (id: string) => {
    nav(`/movie/${id}`)
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {q && (
        <section className="mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Risultati per "{q}"</h2>

          {fetching && (
            <div className="flex justify-center items-center h-20">
              <FaSpinner className="animate-spin text-blue-500 text-3xl" />
            </div>

          )}

          {msg && !fetching && (
            <p className="text-red-500 text-center">{msg}</p>
          )}

          {!fetching && !msg && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {results.map(m => (
                <MovieCard
                  key={m.imdbID}
                  imdbID={m.imdbID}
                  title={m.Title}
                  year={m.Year}
                  poster={m.Poster}
                  onClick={goToDetail}
                />
              ))}
            </div>
          )}

          {!fetching && !msg && results.length === 0 && (
            <p className="text-gray-600 text-center">Nessun film trovato.</p>
          )}
        </section>
      )}

{!q && (
  <div className="space-y-10">
    <section className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">🎥 Benvenuto su CineFlix</h1>
      <p className="text-gray-600 max-w-xl mx-auto">
        Scopri, esplora e salva i tuoi film preferiti. Con CineFlix puoi cercare film, vedere le loro schede dettagliate
        e creare una lista dei tuoi titoli preferiti.
      </p>
    </section>

    <div className="grid gap-6 md:grid-cols-3">
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-2">🔍 Cerca Film</h2>

        <p className="text-gray-600 leading-relaxed">
          Usa la barra di ricerca per trovare film. Digita un titolo, attore o genere per iniziare.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-2">📄 Dettagli Film</h2>
        <p className="text-gray-600 leading-relaxed">
          Ogni film ha una scheda dettagliata con tutte le informazioni utili per aiutarti nella scelta.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-2">⭐️ Preferiti</h2>
        <p className="text-gray-600 leading-relaxed">

          Aggiungi i film che ti piacciono ai preferiti cliccando sulla stella.
        </p>
      </div>
    </div>
  </div>
)}


    </div>
  )
}

export default Home
