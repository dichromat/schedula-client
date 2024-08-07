import { createContext, useContext, useState } from "react";
import { Assignment, AssignmentInfo } from "../utils/types";
import { useAssignments } from "../utils/hooks";
import { useUserdataContext } from "./userdata-context";
import { useNavigate } from "react-router-dom";

type AssignmentsContextType = {
    assignments: Assignment[]
    setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>
    hydrate: (value: AssignmentInfo) => Assignment
    isTemplate: boolean
    setIsTemplate: React.Dispatch<React.SetStateAction<boolean>>
}

const AssignmentsContext = createContext<AssignmentsContextType | null>(null)

interface AssignmentsProviderProps {
    children: React.ReactNode
}

export const AssignmentsProvider: React.FC<AssignmentsProviderProps> = ({ children }) => {
    const {userdata: [username, iv, token, ]} = useUserdataContext()
    const navigate = useNavigate()

    const [assignments, setAssignments, hydrate] = useAssignments([username, iv, token, navigate])

    const [isTemplate, setIsTemplate] = useState(false)

    return (
        <AssignmentsContext.Provider value={{assignments, setAssignments, hydrate, isTemplate, setIsTemplate}}>
            {children}
        </AssignmentsContext.Provider>
    )
}

export const useAssignmentsContext = () => {
    const context = useContext(AssignmentsContext)
    if (!context) {
        throw new Error(
            "useAssignmentsContext must be used within a AssignmentsProvider"
        )
    }
    return context
}

