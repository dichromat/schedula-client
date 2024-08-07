import { useState, createContext, useContext } from "react"

interface UserdataProviderProps {
    children: React.ReactNode
}

type UserdataContextType = {
    userdata: string[]
    setUserdata: React.Dispatch<React.SetStateAction<string[]>>
}

const UserdataContext = createContext<UserdataContextType | null>(null)

export const UserdataProvider: React.FC<UserdataProviderProps> = ({ children }) => {
    const [userdata, setUserdata] = useState<(string[])>(
        [localStorage.getItem('username') || "", localStorage.getItem('iv') || "", localStorage.getItem('token') || "", localStorage.getItem('tokenIssued') || ""]
    )

    return (
        <UserdataContext.Provider value={{userdata, setUserdata}}>
            {children}
        </UserdataContext.Provider>
    )
}

export const useUserdataContext = () => {
    const context = useContext(UserdataContext)
    if (!context) {
        throw new Error(
            "useUserdataContext must be used within a UserdataProvider"
        )
    }
    return context
}