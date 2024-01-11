import { createSlice } from "@reduxjs/toolkit"
import { createNew, getAll, updateOne} from "../../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action){
      return [...state, action.payload]
    },
    voteAnecdote(state, action){
      const {id} = action.payload
      return state.map(anecdote => anecdote.id !== id ? anecdote : action.payload).sort((a,b) => b.votes - a.votes)
    },
    setAnedotes(state, action){
      return action.payload.sort((a,b) => b.votes - a.votes)
    }
  }
})

export const {appendAnecdote, voteAnecdote, setAnedotes} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await getAll()
    dispatch(setAnedotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const createdAnecdote = await createNew(content)
    dispatch(appendAnecdote(createdAnecdote))
  }
}

export const updateAnecdote = (anecdote) =>{
  return async dispatch => {
    const updatedAnecdote = await updateOne(anecdote)
    dispatch(voteAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer
