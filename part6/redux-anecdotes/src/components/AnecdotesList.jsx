import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import {clearNotification, setNotification} from "../reducers/notificationReducer"

const AnecdotesList = () => {
const anecdotes = useSelector(state => {
  if(state.filter !== ''){
    return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
  }
  return state.anecdotes
})
const dispatch = useDispatch()

const vote = (anecdote) => {
  dispatch(voteAnecdote(anecdote.id))
  dispatch(setNotification(`you voted '${anecdote.content}'`))
  setTimeout(() => {
    dispatch(clearNotification())
  }, 5000)
}
  return(
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}    
    </>
  )
}

export default AnecdotesList