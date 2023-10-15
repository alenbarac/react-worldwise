import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './pages/AppLayout'
import Homepage from './pages/Homepage'
import PageNotFound from './pages/PageNotFound'
import Product from './pages/Product'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import CityList from './components/CityList'
import City from './components/City'
import CountryList from './components/CountryList'

const BASE_URL = 'http://localhost:8000'

function App() {
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

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="login" element={<Login />} />
        <Route path="app" element={<AppLayout />}>
          <Route index element={<CityList cities={cities} loading={loading} />} />
          <Route path="cities" element={<CityList cities={cities} loading={loading} />} />
          <Route path="cities/:id" element={<City />} />
          <Route path="countries" element={<CountryList cities={cities} loading={loading} />} />
          <Route path="form" element={<p>Form Component</p>} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
