const mongoose = require('mongoose')

if (process.argv.length < 3) {
	console.log('give password as argument')
	process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose
	.connect(url)
// eslint-disable-next-line no-unused-vars
	.then((result) => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.error('error connecting to MongoDB:', error.message)
		process.exit(1)
	})

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
	Person.find({}).then((result) => {
		console.log('phonebook:')
		result.forEach((person) => {
			console.log(person.name + ' ' + person.number)
		})
		mongoose.connection.close()
		process.exit(0)
	})
} else {
	const newPerson = new Person({
		name: process.argv[3],
		number: process.argv[4],
	})
	// eslint-disable-next-line no-unused-vars
	newPerson.save().then((result) => {
		console.log(
			`added ${newPerson.name} number ${newPerson.number} to phonebook`
		)
		mongoose.connection.close()
	})
}
