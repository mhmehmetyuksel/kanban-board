import './index.css'
import Column from './components/Column/Column'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { setTasks } from './redux/tasks'
import Popup from 'reactjs-popup'
import { useState } from 'react'

function App() {

  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state.tasks.data)
  const [open, setOpen] = useState<boolean>(false)
  const [newTitle, setNewTitle] = useState<string>('')

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId, type } = result

    // User dropped the item undraggable area.
    if (!destination) return

    // User dropped the item same area
    if (destination.droppableId === source.draggableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId]
    const finish = data.columns[destination.droppableId]


    if (type === 'column') {
      const newColumnOrder = Array.from(data.columnOrder)
      newColumnOrder.splice(source.index, 1)
      newColumnOrder.splice(destination.index, 0, draggableId)

      const newOrder = {
        ...data,
        columnOrder: newColumnOrder
      }
      dispatch(setTasks(newOrder))
      return
    }

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      //removing dragged item from first place
      newTaskIds.splice(source.index, 1)

      //inserting dragged item to dropped area
      newTaskIds.splice(destination.index, 0, draggableId)

      // updating column
      const newColumn = {
        ...start,
        taskIds: newTaskIds
      }
      // updating initialData 
      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn
        }
      }
      // updating state with new data
      dispatch(setTasks(newState))
      return
    }


    // Dragging to another column

    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)
    const newStart = {
      ...start,
      taskIds: startTaskIds
    }

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    }

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }

    dispatch(setTasks(newState))

  }

  const addTask = (content: string, column: string) => {

    let keys = Object.keys(data.tasks)
    let newId = Number(keys[keys.length - 1].split("-")[1]) + 1

    let tasks = Object.assign({}, data.tasks)
    tasks[`task-${newId}`] = { id: `task-${newId}`, content }

    let destination = data.columns[column]

    let taskIds = Array.from(destination.taskIds)
    taskIds.push(`task-${newId}`)

    dispatch(setTasks({
      ...data,
      tasks,
      columns: {
        ...data.columns,
        [column]: {
          ...data.columns[column],
          taskIds: taskIds
        }
      }
    })
    )
  }

  const createNewColumn = (name: string) => {

    let index = data.columnOrder.findIndex((column: string) => column === name)
    if (index !== -1) return

    let copiedData = Object.assign({}, data)
    let newData = {
      ...copiedData,
      columns: {
        ...copiedData.columns,
        [name]: {
          id: name,
          title: name,
          taskIds: []
        }
      },
      columnOrder: [...copiedData.columnOrder, name]
    }
    dispatch(setTasks(newData))
    setOpen(false)
  }

  return (
    <div className='flex justify-center items-center'>
      <DragDropContext
        onDragEnd={onDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
          {(provided) => (
            <div className='flex text-2xl' {...provided.droppableProps} ref={provided.innerRef}>
              {
                data.columnOrder.map((columnId: string, index: number) => {
                  const column = data.columns[columnId]
                  const tasks = column.taskIds.map((taskId: string) => data.tasks[taskId])
                  return (<Column key={column.id} column={column} tasks={tasks} addTask={addTask} index={index} />)
                })
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>

      </DragDropContext>
      <button className="text-7xl" onClick={() => setOpen(true)}> + </button>
      <Popup onClose={() => setOpen(false)} open={open} modal>
        <div className='bg-white h-full w-full p-12 text-black border-2 border-black flex flex-col'>
          Yeni bir alan oluşturmak için lütfen başlığı giriniz...
          <input className='my-3 rounded-md px-1' placeholder='Başlık girin' onChange={(e) => setNewTitle(e.target.value)} />
          <button className='border bg-blue-500 w-1/2 mx-auto rounded-md' onClick={() => createNewColumn(newTitle)}>Oluştur</button>
        </div>
      </Popup>
    </div>
  )
}

export default App
