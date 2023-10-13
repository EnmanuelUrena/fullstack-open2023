const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

const PORT = process.env.PORT || 3001

// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) =>
	req.method === 'POST' ? JSON.stringify(req.body) : ''
)
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res, next) => {
	Person.find({})
		.then((persons) => {
			res.send(
				`<p>Phonebook has info for ${
					persons.length
				} people</p><p>${new Date()}</p>`
			)
		})
		.catch((error) => next(error))
})

app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((persons) => {
			res.json(persons)
		})
		.catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	Person.findById(id)
		.then((findPerson) => {
			findPerson ? res.json(findPerson) : res.status(404).end()
		})
		.catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	Person.findByIdAndRemove(id)
	// eslint-disable-next-line no-unused-vars
		.then((result) => {
			return res.status(204).end()
		})
		.catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).json({ error: 'The name or number is missing' })
	}

	const newPerson = new Person({
		...body,
	})

	newPerson
		.save()
		.then((savedPerson) => {
			res.json(savedPerson)
		})
		.catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const id = req.params.id
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).json({ error: 'The name or number is missing' })
	}
	const updatePerson = {
		...body,
	}

	Person.findByIdAndUpdate(id, updatePerson, { new: true })
		.then((updatedPerson) => {
			res.json(updatedPerson)
		})
		.catch((error) => next(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).json({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`)
})
