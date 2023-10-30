import { useReducer } from 'react'
import { useContext } from 'react'
import { createContext } from 'react'

const AuthContext = createContext()

const initalState = {
  user: null,
  isAuthenticated: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, isAuthenticated: true, user: action.payload }

    case 'logout':
      return { ...state, isAuthenticated: false, user: null }

    default:
      throw new Error('Unknown action type called')
  }
}

const FAKE_USER = {
  name: 'Jack',
  email: 'jack@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initalState)

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: 'login', payload: FAKE_USER })
    }
  }

  function logout() {
    dispatch({ type: 'logout' })
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('Context is used outside the Auth Provider')
  return context
}

export { AuthProvider, useAuth }
