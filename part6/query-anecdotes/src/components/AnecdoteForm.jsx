import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdotes } from "../request"
import { useNotificationDispatch } from "../context/NotificationContext"

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdotes, 
    onSuccess: (newAnecdote) => {
    const anecdotesList = queryClient.getQueryData(['anecdotes'])
    queryClient.setQueryData(['anecdotes'], anecdotesList.concat(newAnecdote))
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: `${newAnecdote.content} has added`
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION'})
    }, 5000)
    },
    onError: (data) => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: data.response.data.error
      })
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION'})
      }, 10000)
    }
}) 

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = {content, votes: 0}
    newAnecdoteMutation.mutate(newAnecdote)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
