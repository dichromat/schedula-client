import red_cross_png from '../assets/red-cross.png'

import { useState } from "react";
import SortableCategory from "./SortableCategory";
import {formatDate, compareFormattedDates} from "../utils/dateUtils";
import { AssignmentInfo } from "../utils/types";
import { dehydrate } from '../utils/dbUtils';
import { useAssignmentsContext } from '../contexts/assignments-context';
import { useUserdataContext } from '../contexts/userdata-context';
import { useSaveButtonContext } from '../contexts/save-button-context';
import { NavigateFunction } from 'react-router-dom';
import { dbSave } from '../utils/dbUtils';
import { useNavBarHandleSave, useSafeTimeout } from '../utils/hooks';

interface AssignmentTableProps {
    navigate: NavigateFunction
}

export default function AssignmentTable({navigate}: AssignmentTableProps) {
    const {userdata: [username, iv, token, ]} = useUserdataContext()
    const {assignments, storeAssignments, hydrate, isTemplate, setIsTemplate} = useAssignmentsContext()
    const {setIsSaving} = useSaveButtonContext()

    const saveToDb = dbSave(username, iv, token)
    const setSafeTimeout = useSafeTimeout()

    const [hoveredCategory, setHoveredCategory] = useState(0)

    const handleNewAssignment = () => {
        const newAssignmentInfo: AssignmentInfo = {
            subject: (document.getElementById("class-input") as HTMLInputElement).value,
            description: (document.getElementById("description-input") as HTMLInputElement).value,
            dueDate: formatDate((document.getElementById("due-date-input") as HTMLInputElement).value),
            status: "Not Completed",
        }
        const newAssignment = hydrate(newAssignmentInfo)

        const updatedAssignments = [newAssignment, ...assignments]
        storeAssignments(updatedAssignments)

        const updatedAssignmentsInfo = updatedAssignments.map(assignment => dehydrate(assignment))
        localStorage.setItem("assignments", JSON.stringify(updatedAssignmentsInfo))
        console.log("Saving assignmentsInfo to local storage")

        const handleSave = useNavBarHandleSave({ assignments: updatedAssignments, navigate, saveToDb, setIsSaving })
        setSafeTimeout(handleSave, 10000)

        setIsTemplate(!isTemplate)
    }

    return (
        <div className="container-fluid">
            <table className="table table-striped table-responsive">
                <thead>
                    <tr>
                        <th className="col-2"><SortableCategory category="Class" hoveredCategory={hoveredCategory} id={1} activatingMethod={(id) => setHoveredCategory(id)}
                        ascendingSortingMethod={() => {storeAssignments(prev => [...prev].sort((a,b) => {return b.subject.localeCompare(a.subject, 'en', { sensitivity: 'base' })}))}}
                        descendingSortingMethod={() => {storeAssignments(prev => [...prev].sort((a,b) => {return a.subject.localeCompare(b.subject, 'en', { sensitivity: 'base' })}))}} /></th>
                        <th className="col-2"><SortableCategory category="Description" hoveredCategory={hoveredCategory} id={2} activatingMethod={(id) => setHoveredCategory(id)}
                        ascendingSortingMethod={() => {storeAssignments(prev => [...prev].sort((a,b) => {return b.description.localeCompare(a.description, 'en', { sensitivity: 'base' })}))}}
                        descendingSortingMethod={() => {storeAssignments(prev => [...prev].sort((a,b) => {return a.description.localeCompare(b.description, 'en', { sensitivity: 'base' })}))}} /></th>
                        <th className="col-2"><SortableCategory category="Due Date" hoveredCategory={hoveredCategory} id={3} activatingMethod={(id) => setHoveredCategory(id)}
                        ascendingSortingMethod={() => {storeAssignments(prev => [...prev].sort((a,b) => {return compareFormattedDates(b.dueDate, a.dueDate)}))}}
                        descendingSortingMethod={() => {storeAssignments(prev => [...prev].sort((a,b) => {return compareFormattedDates(a.dueDate, b.dueDate)}))}} /></th>
                        <th className="col-2"><SortableCategory category="Status" hoveredCategory={hoveredCategory} id={4} activatingMethod={(id) => setHoveredCategory(id)}
                        ascendingSortingMethod={() => {storeAssignments(prev => [...prev].sort((a,b) => {return b.status.localeCompare(a.status, 'en', { sensitivity: 'base' })}))}}
                        descendingSortingMethod={() => {storeAssignments(prev => [...prev].sort((a,b) => {return a.status.localeCompare(b.status, 'en', { sensitivity: 'base' })}))}}
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
                                storeAssignments(prev => prev.map(assignment => assignment.id == id ? {...assignment, isStatusHovered: true} : assignment))
                            }} onMouseLeave={() => {
                                storeAssignments(prev => prev.map(assignment => assignment.id == id ? {...assignment, isStatusHovered: false} : assignment))
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
                                storeAssignments(prev => prev.map(assignment => assignment.id == id ? {...assignment, isStatusHovered: true} : assignment))
                            }} onMouseLeave={() => {
                                storeAssignments(prev => prev.map(assignment => assignment.id == id ? {...assignment, isStatusHovered: false} : assignment))
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