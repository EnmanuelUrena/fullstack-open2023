const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const app = express();

const PORT = process.env.PORT || 3001;

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

function generateRandomIds() {
  return Math.floor(Math.random() * 999999) + 4;
}

morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : "")
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person) : res.status(404).end()
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if(person)
  {
    persons = persons.filter(personToDelete => personToDelete.id !== person.id)
    return res.status(204).end()
  }
  else{
    return res.status(404).end()
  }
})

app.post("/api/persons", (req, res) => {
  const body = req.body
  if(!body.name || !body.number)
  {
    return res.status(400).json({ error: 'The name or number is missing' })
  }
  if(persons.find(person => person.name === body.name))
  {
    return res.status(400).json({ error: 'name must be unique' })
  }
  const newPerson = {id: generateRandomIds(), ...body}
  persons = persons.concat(newPerson)
  res.json(newPerson)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})