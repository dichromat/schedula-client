import { createContext, useContext, useState } from "react";

type SaveButtonContextType = {
    isSaving: boolean
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>
}

const SaveButtonContext = createContext<SaveButtonContextType | null>(null)

interface SaveButtonProviderProps {
    children: React.ReactNode
}

export const SaveButtonProvider: React.FC<SaveButtonProviderProps> = ({ children }) => {
    const [isSaving, setIsSaving] = useState(false)

    return (
        <SaveButtonContext.Provider value={{isSaving, setIsSaving}}>
            {children}
        </SaveButtonContext.Provider>
    )
}

export const useSaveButtonContext = () => {
    const context = useContext(SaveButtonContext)
    if (!context) {
        throw new Error(
            "useSaveButtonContext must be used within a SaveButtonProvider"
        )
    }
    return context
}