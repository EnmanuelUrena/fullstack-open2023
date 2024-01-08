import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"

const AnecdotesList = () => {
const anecdotes = useSelector(state => state)
const dispatch = useDispatch()

const vote = (id) => {
  dispatch(voteAnecdote(id))
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
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}    
    </>
  )
}

export default AnecdotesList