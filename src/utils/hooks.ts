import { NavigateFunction } from "react-router-dom";
import { Assignment, AssignmentInfo } from "../utils/types";
import { useState, useRef, useEffect } from "react";

export function useAssignments([username, iv, token, navigate]: [string, string, string, NavigateFunction]) {
    const apiUrl = import.meta.env.VITE_API_URL

    const dbInit = useRef(false)

    const hydrated = (info: AssignmentInfo) => {
        const newID = crypto.randomUUID()
        const hydratedAssignment: Assignment = {...info,
            id: newID,
            isStatusHovered: false,
            handleCompleted: () => {
                $setAssignments(prev => prev.map(assignment => assignment.id == newID ? {...assignment, status: assignment.status === "Completed" ? "Not Completed" : "Completed"} : assignment))
            },
            handleRemove: () => {
                $setAssignments(prev => prev.filter(assignment => assignment.id !== newID))
            }}
        return hydratedAssignment
    }

    const dehydrated = ({subject, description, dueDate, status}: Assignment) => {
        const dehydratedAssignment: AssignmentInfo = {subject, description, dueDate, status}
        return dehydratedAssignment
    }

    const $setAssignments = (input: Assignment[] | ((prev: Assignment[]) => Assignment[])) => {
        setAssignments(prevAssignments => {
            const newAssignments = typeof input === 'function' ? input(prevAssignments) : input
            setAssignmentsInfo(newAssignments.map(assignment => dehydrated(assignment)))
            return newAssignments
        })
    }

    const $setAssignmentsInfo = (input: AssignmentInfo[]) => {
        setAssignmentsInfo(input)
        setAssignments(input.map(assignmentInfo => hydrated(assignmentInfo)))
    }

    const [assignmentsInfo, setAssignmentsInfo] = useState<AssignmentInfo[]>(() => {
        const localAssignmentsInfo = localStorage.getItem('assignments')
        if (localAssignmentsInfo) {
            console.log("Initializing from local storage")
            return JSON.parse(localAssignmentsInfo)
        }
        else {
            console.log("Initializing from database")
            dbInit.current = true
            return []
        }
    })

    const [assignments, setAssignments] = useState<Assignment[]>(() => {
        if (dbInit.current) return []
        else return assignmentsInfo.map(assignmentInfo => hydrated(assignmentInfo))
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
                    $setAssignmentsInfo(dbAssignmentsInfo)
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
                    $setAssignmentsInfo([])
                    break
                case 500:
                    const { error } = data
                    console.log(error)
                    $setAssignmentsInfo([])
                    break
                default:
                    console.log("An unexpected error occurred")
                    $setAssignmentsInfo([])
                    break
            }
        }
        if (dbInit.current) {
            initializeAssignments()
            dbInit.current = false
        } 
    }, [])

    return { assignments, assignmentsInfo, setAssignments, $setAssignments }
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
