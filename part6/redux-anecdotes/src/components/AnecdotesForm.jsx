import { newAnecdote } from "../reducers/anecdoteReducer"
import { useDispatch } from "react-redux"

const AnecdotesForm = () => {
  const dispatch = useDispatch()

  const addAdnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ""
    dispatch(newAnecdote(content))
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