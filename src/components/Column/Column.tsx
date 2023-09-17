import { useState } from "react"
import Task from "../Task/Task"
import { Droppable, Draggable } from "react-beautiful-dnd"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setTasks } from "../../redux/tasks"
import { ColumnProps } from "./type"

function Column({ index, addTask, column, tasks }: ColumnProps) {
    const dispatch = useAppDispatch()
    const data = useAppSelector((state) => state.tasks.data)

    const [newTask, setNewTask] = useState<string>('')
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            addTask(newTask, column.id)
            setNewTask('')
        }
    }

    const removeColumn = (columnId: string) => {
        let newData = {
            ...data,
            columnOrder: data.columnOrder.filter((column: string) => column !== columnId)
        }
        dispatch(setTasks(newData))
    }

    return (
        <Draggable draggableId={column.id} index={index}>
            {(provided) => (
                <div {...provided.draggableProps} ref={provided.innerRef} className="relative m-3 border border-gray-500 rounded-sm w-48 min-h-[600px] text-center flex flex-col pb-9">
                    <div {...provided.dragHandleProps} className="p-3 bg-gray-300 flex justify-between items-center"><span>{column.title}</span> <button onClick={() => removeColumn(column.id)} className="text-red-600 border border-red-600 text-xs px-1 w-fit h-fit rounded-md hover:bg-red-600 hover:text-white">Sil</button></div>
                    <Droppable droppableId={column.id} type="task">
                        {(provided, snapshot) => (
                            <div style={{ backgroundColor: snapshot.isDraggingOver ? 'yellowgreen' : 'white' }} className="p-3" ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    tasks.map((task, index: number) => <Task key={task.id} task={task} index={index} columnId={column.id} />)
                                }
                                {provided.placeholder}
                            </div>

                        )}

                    </Droppable>
                    <input value={newTask} onKeyDown={handleKeyDown} onChange={(e) => setNewTask(e.target.value)} placeholder="Görev gir" type="text" className="absolute right-2 bottom-1 w-[90%] h-5 text-sm border-2 border-black px-1 rounded-md placeholder:text-sm placeholder:text-black" />
                </div>
            )}

        </Draggable>
    )
}

export default Column