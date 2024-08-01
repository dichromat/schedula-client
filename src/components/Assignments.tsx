import AssignmentTable from "./AssignmentTable";
import NavBar from "./NavBar";
import { useState, useCallback, useEffect } from "react";
import {useAssignments, useChange} from "../utils/hooks";
import { useNavigate } from "react-router-dom"

interface AssignmentsProps {
    userdata: string[]
}

export default function Assignments({userdata: [username, iv, token, tokenIssued]}: AssignmentsProps) {
    const navigate = useNavigate()
    useEffect(() => {
        if (!username || !iv || !token || !tokenIssued) {
            navigate('/')
        }
        else {
            const tokenTime = new Date(tokenIssued).getTime()
            const currentTime = new Date().getTime()
            const hoursElapsed = (currentTime-tokenTime) / (1000*60*60)

            if (hoursElapsed < 0 || hoursElapsed > 1) {
                console.log("Client date check failed")
                navigate('/')
            }
        }
    }, [username, iv, token, tokenIssued])

    const [isTemplate, setIsTemplate] = useState(false)

    const { assignments, assignmentsInfo, setAssignments, $setAssignments } = useAssignments([username, iv, token, navigate])

    useChange(() => {
        console.log("Saving assignmentsInfo to local storage")
        saveToLocalStorage()
    }, [assignmentsInfo])

    const saveToLocalStorage = () => {
        localStorage.setItem('assignments', JSON.stringify(assignmentsInfo))
    }

    const saveToDb = useCallback(async () => {
        const response = await fetch('http://localhost:3000/save', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, iv, token, "assignments": assignmentsInfo})
        })
    
        const data = await response.json()
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
    }, [assignmentsInfo])

    return (
        <>
            <NavBar {...{ isTemplate, setIsTemplate, saveToDb }} />
            <AssignmentTable {...{ assignments, setAssignments, $setAssignments, isTemplate, setIsTemplate }} />
        </>
    )
}
