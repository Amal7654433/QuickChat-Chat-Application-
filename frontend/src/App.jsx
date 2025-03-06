import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Counter from './counter'
import Home from './home'
function App() {
  const [name, setName] = useState('david')
  let array=['messi','ronaldo','hazard']
  return (
    <>
 
   <Home values={array} />
    </>
  )
}

export default App
