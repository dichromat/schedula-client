import { NavigateFunction } from "react-router-dom";
import { Assignment, AssignmentInfo } from "../utils/types";
import { useState, useRef, useEffect } from "react";

export function useAssignments([username, iv, token, navigate]: [string, string, string, NavigateFunction]): [Assignment[], React.Dispatch<React.SetStateAction<Assignment[]>>, (value: AssignmentInfo) => Assignment] {
    const apiUrl = import.meta.env.VITE_API_URL

    const dbInit = useRef(false)

    const hydrate = (info: AssignmentInfo) => {
        const newID = crypto.randomUUID()
        const hydratedAssignment: Assignment = {...info,
            id: newID,
            isStatusHovered: false,
            handleCompleted: () => {
                setAssignments(prev => {
                    const updatedAssignments = prev.map(assignment => assignment.id == newID ? {...assignment, status: assignment.status === "Completed" ? "Not Completed" : "Completed"} : assignment)
                    const updatedAssignmentsInfo = updatedAssignments.map(assignment => dehydrate(assignment))
                    localStorage.setItem("assignments", JSON.stringify(updatedAssignmentsInfo))
                    console.log("Saving assignmentsInfo to local storage")
                    return updatedAssignments
                })
            },
            handleRemove: () => {
                setAssignments(prev => {
                    const updatedAssignments = prev.filter(assignment => assignment.id !== newID)
                    const updatedAssignmentsInfo = updatedAssignments.map(assignment => dehydrate(assignment))
                    localStorage.setItem("assignments", JSON.stringify(updatedAssignmentsInfo))
                    console.log("Saving assignmentsInfo to local storage")
                    return updatedAssignments
                })
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
                    setAssignments(dbAssignmentsInfo.map(assignmentInfo => hydrate(assignmentInfo)))
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

    return [assignments, setAssignments, hydrate]
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

export function useSafeTimeout(task: () => void, time: number) {
    const prevTimeout = useRef<(undefined | NodeJS.Timeout)>()

    const safeSetTimeout = () => {
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
