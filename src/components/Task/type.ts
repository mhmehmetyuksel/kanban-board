import { Task } from "../../redux/tasks"

export interface TaskProps {
    index: number
    task: Task
    columnId: string
}