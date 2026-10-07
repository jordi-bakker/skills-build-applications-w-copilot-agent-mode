import express, { type NextFunction, type Request, type Response } from 'express'
import { connectDatabase } from './config/database.js'
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js'

const app = express()
const port = 8000
const codespaceName = process.env.CODESPACE_NAME
const baseUrl = codespaceName
  ? `https://${codespaceName}-${port}.app.github.dev`
  : `http://localhost:${port}`

app.use(express.json())

app.get('/api/', (_request, response) => {
  response.json({ message: 'OctoFit Tracker API', baseUrl })
})

const collectionRoutes = [
  ['/api/users/', User],
  ['/api/teams/', Team],
  ['/api/activities/', Activity],
  ['/api/leaderboard/', LeaderboardEntry],
  ['/api/workouts/', Workout],
] as const

for (const [path, collectionModel] of collectionRoutes) {
  app.get(path, async (_request, response, next) => {
    try {
      const records = await collectionModel.find().lean().exec()
      response.json(records)
    } catch (error) {
      next(error)
    }
  })
}

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error('API request failed:', error)
  response.status(500).json({ error: 'Unable to retrieve requested data' })
})

async function startServer() {
  try {
    await connectDatabase()
    app.listen(port, () => {
      console.log(`OctoFit Tracker API listening at ${baseUrl}`)
    })
  } catch (error) {
    console.error('Unable to start OctoFit Tracker API:', error)
    process.exitCode = 1
  }
}

void startServer()
