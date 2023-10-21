import { createContext, useEffect, useState } from 'react'

const CitiesContext = createContext()
const BASE_URL = 'http://localhost:8000'

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(false)

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

  return <CitiesContext.Provider value={{ cities, loading }}>{children}</CitiesContext.Provider>
}

export { CitiesProvider }
