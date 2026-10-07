import mongoose, { Types } from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    const ids = {
      users: [
        new Types.ObjectId('650000000000000000000001'),
        new Types.ObjectId('650000000000000000000002'),
        new Types.ObjectId('650000000000000000000003'),
        new Types.ObjectId('650000000000000000000004'),
      ],
      teams: [
        new Types.ObjectId('660000000000000000000001'),
        new Types.ObjectId('660000000000000000000002'),
      ],
      activities: [
        new Types.ObjectId('670000000000000000000001'),
        new Types.ObjectId('670000000000000000000002'),
        new Types.ObjectId('670000000000000000000003'),
        new Types.ObjectId('670000000000000000000004'),
        new Types.ObjectId('670000000000000000000005'),
        new Types.ObjectId('670000000000000000000006'),
      ],
      leaderboard: [
        new Types.ObjectId('680000000000000000000001'),
        new Types.ObjectId('680000000000000000000002'),
        new Types.ObjectId('680000000000000000000003'),
        new Types.ObjectId('680000000000000000000004'),
      ],
      workouts: [
        new Types.ObjectId('690000000000000000000001'),
        new Types.ObjectId('690000000000000000000002'),
        new Types.ObjectId('690000000000000000000003'),
        new Types.ObjectId('690000000000000000000004'),
      ],
    };

    const collections = [
      {
        model: User,
        records: [
          { _id: ids.users[0], username: 'alex-rivera', email: 'alex@example.com', displayName: 'Alex Rivera', teamId: ids.teams[0] },
          { _id: ids.users[1], username: 'sam-chen', email: 'sam@example.com', displayName: 'Sam Chen', teamId: ids.teams[0] },
          { _id: ids.users[2], username: 'jordan-lee', email: 'jordan@example.com', displayName: 'Jordan Lee', teamId: ids.teams[1] },
          { _id: ids.users[3], username: 'taylor-morgan', email: 'taylor@example.com', displayName: 'Taylor Morgan', teamId: ids.teams[1] },
        ],
      },
      {
        model: Team,
        records: [
          { _id: ids.teams[0], name: 'Trail Blazers', description: 'Outdoor runners building weekly consistency.', memberIds: [ids.users[0], ids.users[1]] },
          { _id: ids.teams[1], name: 'Peak Performers', description: 'A balanced crew focused on strength and endurance.', memberIds: [ids.users[2], ids.users[3]] },
        ],
      },
      {
        model: Activity,
        records: [
          { _id: ids.activities[0], userId: ids.users[0], teamId: ids.teams[0], type: 'run', durationMinutes: 35, distanceKm: 5.2, points: 52, completedAt: new Date('2026-10-05T07:30:00Z') },
          { _id: ids.activities[1], userId: ids.users[1], teamId: ids.teams[0], type: 'cycling', durationMinutes: 45, distanceKm: 14, points: 45, completedAt: new Date('2026-10-05T17:00:00Z') },
          { _id: ids.activities[2], userId: ids.users[2], teamId: ids.teams[1], type: 'strength', durationMinutes: 40, points: 40, completedAt: new Date('2026-10-06T08:00:00Z') },
          { _id: ids.activities[3], userId: ids.users[3], teamId: ids.teams[1], type: 'walk', durationMinutes: 50, distanceKm: 4.1, points: 25, completedAt: new Date('2026-10-06T12:15:00Z') },
          { _id: ids.activities[4], userId: ids.users[0], teamId: ids.teams[0], type: 'yoga', durationMinutes: 30, points: 30, completedAt: new Date('2026-10-07T06:45:00Z') },
          { _id: ids.activities[5], userId: ids.users[2], teamId: ids.teams[1], type: 'run', durationMinutes: 28, distanceKm: 4, points: 40, completedAt: new Date('2026-10-07T07:15:00Z') },
        ],
      },
      {
        model: LeaderboardEntry,
        records: [
          { _id: ids.leaderboard[0], userId: ids.users[0], teamId: ids.teams[0], points: 82, rank: 1, period: '2026-10' },
          { _id: ids.leaderboard[1], userId: ids.users[2], teamId: ids.teams[1], points: 80, rank: 2, period: '2026-10' },
          { _id: ids.leaderboard[2], userId: ids.users[1], teamId: ids.teams[0], points: 45, rank: 3, period: '2026-10' },
          { _id: ids.leaderboard[3], userId: ids.users[3], teamId: ids.teams[1], points: 25, rank: 4, period: '2026-10' },
        ],
      },
      {
        model: Workout,
        records: [
          { _id: ids.workouts[0], title: 'Easy Base Run', description: 'Keep a conversational pace and finish with light stretching.', activityType: 'run', durationMinutes: 30, difficulty: 'beginner', targetUserId: ids.users[0] },
          { _id: ids.workouts[1], title: 'Tempo Ride', description: 'Alternate steady cycling with short controlled efforts.', activityType: 'cycling', durationMinutes: 40, difficulty: 'intermediate', targetUserId: ids.users[1] },
          { _id: ids.workouts[2], title: 'Full-body Strength', description: 'Complete three controlled rounds of foundational movements.', activityType: 'strength', durationMinutes: 35, difficulty: 'intermediate', targetUserId: ids.users[2] },
          { _id: ids.workouts[3], title: 'Recovery Mobility', description: 'Use gentle mobility drills to restore range of motion.', activityType: 'mobility', durationMinutes: 20, difficulty: 'beginner', targetUserId: ids.users[3] },
        ],
      },
    ];

    for (const { model, records } of collections) {
      await model.bulkWrite(records.map((record) => ({
        replaceOne: {
          filter: { _id: record._id },
          replacement: record,
          upsert: true,
        },
      })));
      console.log(`Seeded ${records.length} ${model.collection.collectionName}`);
    }

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      process.exitCode = 1;
    }
  }
}

void seedDatabase();
