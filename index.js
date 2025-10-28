require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => { response.json({"persons": persons}) })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }    
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  console.log("request ", request.params)
  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const id = Math.floor(Math.random() * 10000)
  const newPerson = {
    "id" : id + "",
    "name": body.name,
    "number": body.number
  }

  if (newPerson.name == "" || newPerson.number == "") {
    return response.status(400).json({
      error: 'name and number must not be empty'
    })
  }

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number,
    id: newPerson.id
  })

  person.save().then(savedPerson => {
    Person.find({}).then(persons => { response.json({"persons": persons}) })
  })
})

app.get('/info', (request, response) => {
  response.send('<p>Phonebook has info for ' + persons.persons.length + ' people<br>' + new Date().toString() + '</p>')
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
