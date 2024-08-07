export type AssignmentInfo = {
    subject: string
    description: string
    dueDate: string
    status: string
}

export type Assignment = AssignmentInfo & {
    id: string
    isStatusHovered: boolean
    handleCompleted(): void
    handleRemove(): void
}