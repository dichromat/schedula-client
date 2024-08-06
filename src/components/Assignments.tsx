import AssignmentTable from "./AssignmentTable";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import { useAssignments } from "../utils/hooks";
import { useNavigate } from "react-router-dom";

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

    const [assignments, setAssignments] = useAssignments([username, iv, token, navigate])
    
    return (
        <>
            <NavBar {...{ isTemplate, setIsTemplate, assignments, username, iv, token, navigate }} />
            <AssignmentTable {...{ assignments, setAssignments, isTemplate, setIsTemplate }} />
        </>
    )
}
