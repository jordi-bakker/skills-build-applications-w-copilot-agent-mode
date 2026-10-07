import { model, Schema } from 'mongoose'

type OctofitRecord = Record<string, unknown>

function createCollectionModel(modelName: string, collectionName: string) {
  const schema = new Schema<OctofitRecord>({}, {
    collection: collectionName,
    strict: false,
  })

  return model<OctofitRecord>(modelName, schema)
}

export const User = createCollectionModel('User', 'users')
export const Team = createCollectionModel('Team', 'teams')
export const Activity = createCollectionModel('Activity', 'activities')
export const LeaderboardEntry = createCollectionModel('LeaderboardEntry', 'leaderboard')
export const Workout = createCollectionModel('Workout', 'workouts')
