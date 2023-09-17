import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Task = {
  id: string,
  content: string
}

export type Column = {
  id: string,
  title: string,
  taskIds: string[]
}

export type Data = {
  data: {
    tasks: {
      [tasks: string]: Task
    },
    columns: {
      [column: string]: Column
    },
    columnOrder: string[]
  }
}


const initialState: Data = {
  data: {
    tasks: {
      'task-1': { id: 'task-1', content: 'Yeni task ekleyebilirsin' },
      'task-2': { id: 'task-2', content: 'Task silebilirsiniz' },
      'task-3': { id: 'task-3', content: 'Sütunların yerlerini değiştir'},
      'task-4': { id: 'task-4', content: 'Sütun ekle veya sil' },
      'task-5': { id: 'task-5', content: 'Sütun yerlerini değiş' },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To do',
        taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In progress',
        taskIds: [],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2', 'column-3'],
  }
}

export const tasks = createSlice({
  name: 'contentManager',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<any>) => {
      state.data = action.payload
    },
  },
},
)

export const { setTasks } = tasks.actions

export default tasks.reducer
