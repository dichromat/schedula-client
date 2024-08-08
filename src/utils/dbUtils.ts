import { Assignment, AssignmentInfo } from "../utils/types";
const apiUrl = import.meta.env.VITE_API_URL

export const dehydrate = ({subject, description, dueDate, status}: Assignment) => {
    const dehydratedAssignment: AssignmentInfo = {subject, description, dueDate, status}
    return dehydratedAssignment
}

export const dbSave = (username: string, iv: string, token: string) => async (assignments: Assignment[]) => {
    const response = await fetch(`${apiUrl}/save`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, iv, token, "assignments": assignments.map(assignment => dehydrate(assignment))})
    })

    const data = await response.json()

    return {response, data}
}