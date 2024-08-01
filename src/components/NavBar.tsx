import { useState } from "react"
import { useChange } from "../utils/hooks"

interface NavBarProps {
  isTemplate: boolean
  setIsTemplate(value: boolean): void
  saveToDb(): void
}

export default function NavBar({isTemplate, setIsTemplate, saveToDb}: NavBarProps) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await saveToDb()
      setIsSaving(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  useChange(() => {
    const autosave = setTimeout(handleSave, 10000)
    console.log("Created")
    
    return () => {
      clearTimeout(autosave)
      console.log("Cleared")
    }
  }, [saveToDb])

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