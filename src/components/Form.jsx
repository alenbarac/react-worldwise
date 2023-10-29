// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useUrlPosition } from '../hooks/useUrlPosition'
import BackButton from './BackButton'
import Button from './Button'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './Form.module.css'
import Message from './Message'
import Spinner from './Spinner'
import { useCities } from '../contexts/CitiesContext'
import { useNavigate } from 'react-router-dom'

function changeFlagEmojiToPNG(flag) {
  if (!/^[a-zA-Z]+$/.test(flag)) {
    flag = Array.from(flag, (codeUnit) =>
      String.fromCharCode(codeUnit.codePointAt() - 127397).toLowerCase()
    ).join('')
  } else {
    flag = flag.toLowerCase()
  }
  return <img src={`https://flagcdn.com/24x18/${flag}.png`} alt="flag" />
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

function Form() {
  const [lat, lng] = useUrlPosition()
  const [cityName, setCityName] = useState('')
  const [country, setCountry] = useState('')
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const [emoji, setEmoji] = useState('')
  const [geocodingError, setGeocodingError] = useState('')
  const navigate = useNavigate()

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)

  const { createCity, isLoading } = useCities()

  useEffect(() => {
    if (!lat && !lng) return

    async function fetchCityData() {
      try {
        setIsLoadingGeocoding(true)
        setGeocodingError('')
        const response = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await response.json()

        console.log(data)

        if (!data.countryCode) throw new Error('No result for a city')

        setCityName(data.city || data.locality || '')
        setCountry(data.countryName)
        setEmoji(data.countryCode)
      } catch (error) {
        setGeocodingError(error.message)
      } finally {
        setIsLoadingGeocoding(false)
      }
    }
    fetchCityData()
  }, [lat, lng])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!cityName || !date) return

    const newCity = {
      cityName,
      country,
      emoji: emoji.toLowerCase(),
      date,
      notes,
      position: { lat, lng },
    }

    //console.log(newCity)
    await createCity(newCity)

    navigate('/app/cities')
  }

  if (isLoadingGeocoding) return <Spinner />

  if (!lat && !lng) return <Message message="Start by clicking on the map." />

  if (geocodingError) return <Message message={geocodingError} />

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ''}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input id="cityName" onChange={(e) => setCityName(e.target.value)} value={cityName} />
        <span className={styles.flag}>{changeFlagEmojiToPNG(emoji)}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input id="date" onChange={(e) => setDate(e.target.value)} value={date} /> */}
        <DatePicker
          id="date"
          onChange={(date) => {
            setDate(date)
          }}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea id="notes" onChange={(e) => setNotes(e.target.value)} value={notes} />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  )
}
export default Form
