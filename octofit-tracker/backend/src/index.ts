import express from 'express'

const app = express()

app.use(express.json())

app.get('/api/', (_request, response) => {
  response.json({ message: 'OctoFit Tracker API' })
})

app.listen(8000, () => {
  console.log('OctoFit Tracker API listening on port 8000')
})
