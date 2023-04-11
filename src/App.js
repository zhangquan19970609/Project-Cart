import React from 'react'
import { useGlobalContext } from './context'

// components
import Navbar from './Navbar'
import CartContainer from './CartContainer'
// items

function App() {
  // 此处的 loading 曾常用 useState 来命名，
  // 但如今使用 globalContext 中的 useReducer.

  const {loading} = useGlobalContext();
  
  if (loading) {
    return (
      <div className='loading'>
        <h1>Loading...</h1>
      </div>
    )
  }

  return (
    <main>
      <Navbar />
      <CartContainer />
    </main>
  )
}

export default App
