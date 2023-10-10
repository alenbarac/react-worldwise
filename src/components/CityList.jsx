import CityItem from './CityItem'
import styles from './CityList.module.css'
import Spinner from './Spinner'

function CityList({ cities, loading }) {
  if (loading) {
    return <Spinner />
  }
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem key={city.id} city={city} />
      ))}
    </ul>
  )
}

export default CityList
