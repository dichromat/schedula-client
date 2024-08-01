export interface AssignmentInfo {
    subject: string
    description: string
    dueDate: string
    status: string
}

export interface Assignment extends AssignmentInfo {
    id: string
    isStatusHovered: boolean
    handleCompleted(): void
    handleRemove(): void
}