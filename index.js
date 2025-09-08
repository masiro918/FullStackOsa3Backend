const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

let persons = {
    "persons": [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
      },
      {
        "id": "5",
        "name": "Kalle",
        "number": "1234"
      },
      {
        "id": "6",
        "name": "Mikko",
        "number": "123"
      },
      {
        "id": "7",
        "name": "Kalvei",
        "number": "123123"
      }
    ]
  }

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.persons.find(person => person.id === id)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons.persons = persons.persons.filter(person => person.id !== id)

  response.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  // todo: add person here
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

  persons.persons.forEach(person => {
    if (person.name === newPerson.name) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
  });
  persons.persons = persons.persons.concat(newPerson)

  response.json(persons.persons)
})

app.get('/info', (request, response) => {
  response.send('<p>Phonebook has info for ' + persons.persons.length + ' people<br>' + new Date().toString() + '</p>')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
