import Assignments from './components/Assignments.tsx';
import Login from './components/Login.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useChange } from './utils/hooks.ts';
import { useUserdataContext } from './contexts/userdata-context.tsx';
import { AssignmentsProvider } from './contexts/assignments-context.tsx';
import { SaveButtonProvider } from './contexts/save-button-context.tsx';

function App() {
  const apiUrl = import.meta.env.VITE_API_URL

  const {userdata: [username, iv, token, tokenIssued], setUserdata} = useUserdataContext()

  useChange(() => {
    localStorage.setItem('username', username)
    localStorage.setItem('iv', iv)
    localStorage.setItem('token', token)
    localStorage.setItem('tokenIssued', tokenIssued)
    console.log("Saving...")
  }, [username, iv, token, tokenIssued])

  useEffect(() => {
    console.log("Created 50 mins")
    const refreshToken = setInterval(async () => {
      const response = await fetch(`${apiUrl}/refresh_token`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, iv, token})
      })

      const data = await response.json()
      switch (response.status) {
        case 200:
            const {newIv, newToken} = data
            const timeString = new Date().toISOString()
            setUserdata([username, newIv, newToken, timeString])
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
        <Route path="/" element={<Login />}></Route>
        <Route path="/assignments" element={
          <SaveButtonProvider>
            <AssignmentsProvider>
              <Assignments />
            </AssignmentsProvider>
          </SaveButtonProvider>
          }></Route>
      </Routes>
    </Router>
  )
}

export default App;