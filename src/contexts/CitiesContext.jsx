import { createContext, useContext, useEffect, useState } from 'react'

const CitiesContext = createContext()
const BASE_URL = 'http://localhost:8000'

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentCity, setCurrentCity] = useState({})

  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true)
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json()
        setCities(data)
      } catch {
        alert('There was a error with data')
      } finally {
        setLoading(false)
      }
    }
    fetchCities()
  }, [])

  async function getCity(id) {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/cities/${id}`)
      const data = await res.json()
      setCurrentCity(data)
    } catch {
      alert('Error during fetching data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, loading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  )
}

function useCities() {
  const context = useContext(CitiesContext)
  if (context === undefined) throw new Error('cities context is used outside the cities provider')
  return context
}

export { CitiesProvider, useCities }
