import styles from './CityItem.module.css'

function CityItem({ city }) {
  const { cityName, country, emoji, date, notes, position } = city
  return (
    <div className={styles.cityItem}>
      <span className={styles.emoji}>{emoji}</span>
    </div>
  )
}

export default CityItem
