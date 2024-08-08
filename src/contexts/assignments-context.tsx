import { createContext, useContext, useState } from "react";
import { Assignment, AssignmentInfo } from "../utils/types";
import { useAssignments, useSafeTimeout } from "../utils/hooks";
import { useUserdataContext } from "./userdata-context";
import { useNavigate } from "react-router-dom";
import { useSaveButtonContext } from "./save-button-context";
import { dbSave } from "../utils/dbUtils";

type AssignmentsContextType = {
    assignments: Assignment[]
    storeAssignments: (data: ["value", Assignment[]] | ["operation", (input: Assignment[]) => Assignment[]]) => Assignment[],
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
    const {setIsSaving} = useSaveButtonContext()
    const saveToDb = dbSave(username, iv, token)
    const setSafeTimeout = useSafeTimeout()

    const navigate = useNavigate()

    const [assignments, storeAssignments, hydrate] = useAssignments({username, iv, token, navigate, saveToDb, setIsSaving, setSafeTimeout})

    const [isTemplate, setIsTemplate] = useState(false)

    return (
        <AssignmentsContext.Provider value={{assignments, storeAssignments, hydrate, isTemplate, setIsTemplate}}>
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

