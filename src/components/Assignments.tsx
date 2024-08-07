import AssignmentTable from "./AssignmentTable";
import NavBar from "./NavBar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserdataContext } from "../contexts/userdata-context";

export default function Assignments() {
    const {userdata: [username, iv, token, tokenIssued]} = useUserdataContext()

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
    
    return (
        <>
            <NavBar {...{ navigate }} />
            <AssignmentTable />
        </>
    )
}
