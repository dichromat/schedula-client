import { NavigateFunction } from "react-router-dom";
import { Assignment, AssignmentInfo } from "../utils/types";
import { useState, useRef, useEffect } from "react";
import { useStoreState } from "./stateUtils";

interface useAssignmentsProps {
    username: string
    iv: string
    token: string
    navigate: NavigateFunction
    saveToDb: (assignments: Assignment[]) => Promise<{
        response: Response;
        data: any;
    }>
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>
    setSafeTimeout: (task: () => void, time: number) => void

}

export function useAssignments({username, iv, token, navigate, saveToDb, setIsSaving, setSafeTimeout}: useAssignmentsProps): [Assignment[], (input: Assignment[] | ((input: Assignment[]) => Assignment[])) => Assignment[], (value: AssignmentInfo) => Assignment] {
    const apiUrl = import.meta.env.VITE_API_URL

    const dbInit = useRef(false)

    const hydrate = (info: AssignmentInfo) => {
        const newID = crypto.randomUUID()
        const hydratedAssignment: Assignment = {...info,
            id: newID,
            isStatusHovered: false,
            handleCompleted: () => {
                const updatedAssignments = storeAssignments(prev => prev.map(assignment => assignment.id == newID ? {...assignment, status: assignment.status === "Completed" ? "Not Completed" : "Completed"} : assignment))
                const updatedAssignmentsInfo = updatedAssignments.map(assignment => dehydrate(assignment))
                localStorage.setItem("assignments", JSON.stringify(updatedAssignmentsInfo))
                console.log("Saving assignmentsInfo to local storage")

                const handleSave = useNavBarHandleSave({ assignments: updatedAssignments, navigate, saveToDb, setIsSaving })
                setSafeTimeout(handleSave, 10000)
            },
            handleRemove: () => {
                const updatedAssignments = storeAssignments(prev => prev.filter(assignment => assignment.id !== newID))

                const updatedAssignmentsInfo = updatedAssignments.map(assignment => dehydrate(assignment))
                localStorage.setItem("assignments", JSON.stringify(updatedAssignmentsInfo))
                console.log("Saving assignmentsInfo to local storage")

                const handleSave = useNavBarHandleSave({ assignments: updatedAssignments, navigate, saveToDb, setIsSaving })
                setSafeTimeout(handleSave, 10000)
            }}
        return hydratedAssignment
    }

    const dehydrate = ({subject, description, dueDate, status}: Assignment) => {
        const dehydratedAssignment: AssignmentInfo = {subject, description, dueDate, status}
        return dehydratedAssignment
    }

    const [assignments, setAssignments] = useState<Assignment[]>(() => {
        const localAssignmentsInfo = localStorage.getItem('assignments')
        if (localAssignmentsInfo) {
            console.log("Initializing from local storage")
            const assignmentsInfo: AssignmentInfo[] = JSON.parse(localAssignmentsInfo) || []
            return assignmentsInfo.map(assignmentInfo => hydrate(assignmentInfo))
        }
        else {
            console.log("Initializing from database")
            dbInit.current = true
            return []
        }
    })

    const storeAssignments = useStoreState<Assignment[]>(assignments, setAssignments)

    useEffect(() => {
        interface AssignmentsResponse {
            assignments: AssignmentInfo[]
            message: string
            error: string
        }
        const initializeAssignments = async () => {
            const response = await fetch(`${apiUrl}/data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, iv, token})
            })
    
            const data: AssignmentsResponse = await response.json()
            switch (response.status) {
                case 200:
                    const {assignments: dbAssignmentsInfo} = data
                    storeAssignments(dbAssignmentsInfo.map(assignmentInfo => hydrate(assignmentInfo)))
                    localStorage.setItem("assignments", JSON.stringify(dbAssignmentsInfo))
                    console.log("Saving fetched assignmentsInfo to local storage")
                    break
                case 401:
                    const { message: credentialsMessage } = data
                    console.log(credentialsMessage)
                    navigate('/')
                    break
                case 409:
                    const { message } = data
                    if (message === "User Has No Assignments") {
                        console.log("User Has No Assignments")
                    }
                    else console.log("An unexpected conflict occurred")
                    break
                case 500:
                    const { error } = data
                    console.log(error)
                    break
                default:
                    console.log("An unexpected error occurred")
                    break
            }
        }
        if (dbInit.current) {
            initializeAssignments()
            dbInit.current = false
        } 
    }, [])

    return [assignments, storeAssignments, hydrate]
}

export function useChange(effect: React.EffectCallback, dependencies: React.DependencyList) {
    const initialDependencies = useRef(dependencies)
    useEffect(() => {
        if (dependencies != initialDependencies.current) {
            const cleanup = effect()
            return cleanup
        }
    }, dependencies)
}

export function useSafeTimeout() {
    const prevTimeout = useRef<(undefined | NodeJS.Timeout)>()

    const safeSetTimeout = (task: () => void, time: number) => {
        if (prevTimeout.current) {
            console.log("Cleared")
            clearTimeout(prevTimeout.current)
        }
        const timeout = setTimeout(task, time)
        prevTimeout.current = timeout
        console.log("Created")
    }

    return safeSetTimeout
}

interface useNavBarHandleSaveProps {
    assignments: Assignment[]
    navigate: NavigateFunction
    saveToDb: (assignments: Assignment[]) => Promise<{
        response: Response;
        data: any;
    }>
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>
}

export const useNavBarHandleSave = ({assignments, navigate, saveToDb, setIsSaving}: useNavBarHandleSaveProps) => {

    const handleSave = async () => {
        try {
          setIsSaving(true)
          const {response, data} = await saveToDb(assignments)
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
    return handleSave
}
