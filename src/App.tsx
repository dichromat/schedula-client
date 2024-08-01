import Assignments from './components/Assignments.tsx';
import Login from './components/Login.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useChange } from './utils/hooks.ts';

function App() {
  const apiUrl = import.meta.env.VITE_API_URL

  const [userdata, setUserdata] = useState<string[]>(() => {
    return [localStorage.getItem('username') || "", localStorage.getItem('iv') || "", localStorage.getItem('token') || "", localStorage.getItem('tokenIssued') || ""]
  })

  useChange(() => {
    localStorage.setItem('username', userdata[0])
    localStorage.setItem('iv', userdata[1])
    localStorage.setItem('token', userdata[2])
    localStorage.setItem('tokenIssued', userdata[3])
    console.log("Saving...")
  }, [userdata])

  useEffect(() => {
    console.log("Created 50 mins")
    const refreshToken = setInterval(async () => {
      const response = await fetch(`${apiUrl}/refresh_token`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"username": userdata[0], "iv": userdata[1], "token": userdata[2]})
      })

      const data = await response.json()
      switch (response.status) {
        case 200:
            const {iv, token} = data
            const timeString = new Date().toISOString()
            setUserdata([userdata[0], iv, token, timeString])
            break
        case 401:
            const { message } = data
            console.log(message)
            break
        case 500:
            const { error } = data
            console.log(error)
            break
        default:
            console.log("An unexpected error occurred")
            break
    }
    }, 50 * 60 * 1000)

    return () => {
      console.log("Cleared 50 mins")
      clearInterval(refreshToken)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login {...{ setUserdata }} />}></Route>
        <Route path="/assignments" element={<Assignments {...{ userdata }} />}></Route>
      </Routes>
    </Router>
  )
}

export default App;