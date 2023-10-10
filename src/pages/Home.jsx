import { Link } from 'react-router-dom'
import PageNav from '../components/PageNav'

function Home() {
  return (
    <div>
      <h1 className="test">World Wise</h1>
      <PageNav />
      <Link to="/app">Go to App</Link>
    </div>
  )
}

export default Home
