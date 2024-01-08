import AnecdotesForm from './components/AnecdotesForm'
import AnecdotesList from './components/AnecdotesList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdotesList />
      <AnecdotesForm />
    </div>
  )
}

export default App