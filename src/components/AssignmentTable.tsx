import red_cross_png from '../assets/red-cross.png'

import { useState } from "react";
import SortableCategory from "./SortableCategory";
import {formatDate, compareFormattedDates} from "../utils/dateUtils";
import { Assignment, AssignmentInfo } from "../utils/types";
import { dehydrate } from '../utils/dbUtils';

interface AssignmentTableProps {
    assignments: Assignment[]
    setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>
    isTemplate: boolean
    setIsTemplate(value: boolean): void
}

export default function AssignmentTable({assignments, setAssignments, isTemplate, setIsTemplate}: AssignmentTableProps) {
    const [hoveredCategory, setHoveredCategory] = useState(0)

    const handleNewAssignment = () => {
        const newID = crypto.randomUUID()
        const newAssignmentInfo: AssignmentInfo = {
            subject: (document.getElementById("class-input") as HTMLInputElement).value,
            description: (document.getElementById("description-input") as HTMLInputElement).value,
            dueDate: formatDate((document.getElementById("due-date-input") as HTMLInputElement).value),
            status: "Not Completed",
        }
        const newAssignment: Assignment = {...newAssignmentInfo,
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
            }
        }
        setAssignments(() => {
            const updatedAssignments = [newAssignment, ...assignments]
            const updatedAssignmentsInfo = updatedAssignments.map(assignment => dehydrate(assignment))
            localStorage.setItem("assignments", JSON.stringify(updatedAssignmentsInfo))
            console.log("Saving assignmentsInfo to local storage")
            return updatedAssignments
        })
        setIsTemplate(!isTemplate)
    }

    return (
        <div className="container-fluid">
            <table className="table table-striped table-responsive">
                <thead>
                    <tr>
                        <th className="col-2"><SortableCategory category="Class" hoveredCategory={hoveredCategory} id={1} activatingMethod={(id) => setHoveredCategory(id)}
                        ascendingSortingMethod={() => {setAssignments(prev => [...prev].sort((a,b) => {return b.subject.localeCompare(a.subject, 'en', { sensitivity: 'base' })}))}}
                        descendingSortingMethod={() => {setAssignments(prev => [...prev].sort((a,b) => {return a.subject.localeCompare(b.subject, 'en', { sensitivity: 'base' })}))}} /></th>
                        <th className="col-2"><SortableCategory category="Description" hoveredCategory={hoveredCategory} id={2} activatingMethod={(id) => setHoveredCategory(id)}
                        ascendingSortingMethod={() => {setAssignments(prev => [...prev].sort((a,b) => {return b.description.localeCompare(a.description, 'en', { sensitivity: 'base' })}))}}
                        descendingSortingMethod={() => {setAssignments(prev => [...prev].sort((a,b) => {return a.description.localeCompare(b.description, 'en', { sensitivity: 'base' })}))}} /></th>
                        <th className="col-2"><SortableCategory category="Due Date" hoveredCategory={hoveredCategory} id={3} activatingMethod={(id) => setHoveredCategory(id)}
                        ascendingSortingMethod={() => {setAssignments(prev => [...prev].sort((a,b) => {return compareFormattedDates(b.dueDate, a.dueDate)}))}}
                        descendingSortingMethod={() => {setAssignments(prev => [...prev].sort((a,b) => {return compareFormattedDates(a.dueDate, b.dueDate)}))}} /></th>
                        <th className="col-2"><SortableCategory category="Status" hoveredCategory={hoveredCategory} id={4} activatingMethod={(id) => setHoveredCategory(id)}
                        ascendingSortingMethod={() => {setAssignments(prev => [...prev].sort((a,b) => {return b.status.localeCompare(a.status, 'en', { sensitivity: 'base' })}))}}
                        descendingSortingMethod={() => {setAssignments(prev => [...prev].sort((a,b) => {return a.status.localeCompare(b.status, 'en', { sensitivity: 'base' })}))}}
                         /></th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {isTemplate && (
                        <tr>
                            <td className="col-2">
                                <input id="class-input" className="form-control" type="text" />
                            </td>
                            <td className="col-6">
                                <input id="description-input"className="form-control" type="text" />
                            </td>
                            <td className="col-2">
                                <input id="due-date-input" className="form-control" type="date" />
                            </td>
                            <td className="col-2">
                                <button onClick={handleNewAssignment} className="btn btn-success">Done</button>
                            </td>
                        </tr>
                    )}
                    {assignments.map(({id, subject, description, dueDate, status, isStatusHovered, handleCompleted, handleRemove}, index) => (
                        <tr key={index}>
                            <td className="col-2">{subject}</td>
                            <td className="col-6">{description}</td>
                            <td className="col-2">{dueDate}</td>
                            {status == "Completed" ? <td onMouseEnter={() => {
                                setAssignments(prev => prev.map(assignment => assignment.id == id ? {...assignment, isStatusHovered: true} : assignment))
                            }} onMouseLeave={() => {
                                setAssignments(prev => prev.map(assignment => assignment.id == id ? {...assignment, isStatusHovered: false} : assignment))
                            }} className="col-2 table-success">
                                {status}
                                {isStatusHovered && (
                                    <>
                                        <input onClick={handleCompleted} className="mx-2" type="checkbox" />
                                        <button onClick={handleRemove} className="btn remover-btn">
                                            <img src={red_cross_png} height="22" alt="Remove" />
                                        </button>
                                    </>
                                )}
                                </td>
                             : <td onMouseEnter={() => {
                                setAssignments(prev => prev.map(assignment => assignment.id == id ? {...assignment, isStatusHovered: true} : assignment))
                            }} onMouseLeave={() => {
                                setAssignments(prev => prev.map(assignment => assignment.id == id ? {...assignment, isStatusHovered: false} : assignment))
                            }} className="col-2 table-danger">
                                {status}
                                {isStatusHovered && (
                                    <>
                                        <input onClick={handleCompleted} className="mx-2" type="checkbox" />
                                        <button onClick={handleRemove} className="btn remover-btn">
                                            <img src={red_cross_png} height="22" alt="Remove" />
                                        </button>
                                    </>
                                )}
                                </td>}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}