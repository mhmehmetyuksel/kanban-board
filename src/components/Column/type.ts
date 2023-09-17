import { Column, Task } from "../../redux/tasks";

export interface ColumnProps {
    key: string
    column: Column
    tasks: Task[]
    addTask: Function
    index: number
}