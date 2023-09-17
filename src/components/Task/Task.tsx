import { Draggable } from "react-beautiful-dnd"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setTasks } from "../../redux/tasks"
import { TaskProps } from "./type"

function Task(props: TaskProps) {

    const dispatch = useAppDispatch()
    const tasks = useAppSelector((state) => state.tasks.data)

    const removeItem = (taskId: string, columnId: string) => {
        const newState = {
            ...tasks,
            columns: {
                ...tasks.columns,
                [columnId]: {
                    ...tasks.columns[columnId],
                    taskIds: tasks.columns[columnId].taskIds.filter((task: string) => task !== taskId)
                }
            }
        }
        dispatch(setTasks(newState))
    }

    return (
        <Draggable draggableId={props.task.id} index={props.index}>
            {
                (provided, snapshot) => (
                    <div
                        {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
                        style={{
                            ...provided.draggableProps.style,
                            backgroundColor: snapshot.isDragging ? 'yellow' : 'white',
                        }}
                        className="border border-gray-500 rounded-sm p-2 mb-1 text-xs flex justify-between items-center"
                    ><span>{props.task.content}</span> <button className="bg-red-400 px-3 rounded-md h-4" onClick={() => removeItem(props.task.id, props.columnId)}>Sil</button></div>
                )
            }

        </Draggable>

    )
}

export default Task