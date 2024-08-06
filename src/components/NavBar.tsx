import { useState } from "react"
import { Assignment } from "../utils/types";
import { NavigateFunction } from "react-router-dom";
import { dbSave } from "../utils/dbUtils";

interface NavBarProps {
  isTemplate: boolean
  setIsTemplate(value: boolean): void
  assignments: Assignment[]
  navigate: NavigateFunction
  username: string
  iv: string
  token: string
}

export default function NavBar({isTemplate, setIsTemplate, assignments, username, iv, token, navigate}: NavBarProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const {response, data} = await dbSave(username, iv, token, assignments)
      switch (response.status) {
        case 200:
            console.log("Data saved")
            break
        case 401:
            const { message } = data
            console.log(message)
            navigate('/')
            break
        case 500:
            const { error } = data
            console.log(error)
            break
        default:
            console.log("An unexpected error occurred")
            break
      }
      setIsSaving(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  /*
  useChange(() => {
    const autosave = setTimeout(handleSave, 10000)
    console.log("Created")
    
    return () => {
      clearTimeout(autosave)
      console.log("Cleared")
    }
  }, [assignments])
  */

  return (
      <nav className="navbar navbar-expand py-3">
      <div className="container-fluid">
          <a href="#" className="navbar-brand text-light mx-5">Schedula</a>
          <ul className="navbar-nav me-5">
            <li className="nav-item" id="nav-item-1">
              <a href="#" className="nav-link text-light">Schedule</a>
            </li>
            <li className="nav-item" id="nav-item-2">
              <a href="#" className="nav-link text-light">Assignments</a>
            </li>
            <li className="nav-item" id="nav-item-3">
              <button onClick={() => setIsTemplate(!isTemplate)} className="btn btn-primary">Add Assignment</button>
            </li>
            <li className="nav-item" id="nav-item-4">
              <button onClick={handleSave} disabled={isSaving} className="btn btn-primary mx-2">{isSaving ? "Saving..." : "Save"}</button>
            </li>
          </ul>
        </div>
    </nav>
  )
}