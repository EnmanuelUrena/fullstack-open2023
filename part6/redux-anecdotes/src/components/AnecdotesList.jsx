import { useSelector, useDispatch } from "react-redux"
import { updateAnecdote } from "../reducers/anecdoteReducer"
import { setNotification} from "../reducers/notificationReducer"

const AnecdotesList = () => {
const anecdotes = useSelector(state => {
  if(state.filter !== ''){
    return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()))
  }
  return state.anecdotes
})
const dispatch = useDispatch()

const vote = (anecdote) => {
  const votedAnecdote = {...anecdote, votes: anecdote.votes + 1}
  dispatch(updateAnecdote(votedAnecdote))
  dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
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