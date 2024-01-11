import { createAnecdote } from "../reducers/anecdoteReducer"
import { useDispatch } from "react-redux"
import { setNotification } from "../reducers/notificationReducer"

const AnecdotesForm = () => {
  const dispatch = useDispatch()

  const addAdnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ""
    dispatch(createAnecdote(content))
    dispatch(setNotification(`${content} has added`, 5))
  }

  return(
    <>
      <h2>create new</h2>
      <form onSubmit={addAdnecdote}>
        <div><input name='anecdote'/></div>
        <button type='submit'>create</button>
      </form>
    </>
  ) 
}

export default AnecdotesForm