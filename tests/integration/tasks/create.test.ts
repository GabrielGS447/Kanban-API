import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { taskModel } from '../../../src/database'
import { fetchEndpoint } from '../__helpers__'

const endpoint = '/tasks'

const newTask = {
  boardId: 1,
  status: 'todo',
  title: 'test',
  description: 'test',
  members: ['test'],
  tags: ['test']
}

describe('Tasks Create endpoint integration tests', () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create() // Here we create the mongoDB instance in memory so we can test without using our database (and it's really fast)
    const uri = mongod.getUri() // Get the URI of the database we just created
    await mongoose.connect(uri) // Here we connect to the mongoDB instance in memory so our application can use it
  })
  
  afterAll(async () => {
    await mongoose.connection.close() // Here we close the connection to the mongoDB instance in memory
    await mongod.stop() // Here we stop the mongoDB instance in memory
  })

  describe('When operation is successful', () => {
    let createdTaskId: string
    it('Should 201 with created task data', async () => {
      const { status, body } = await fetchEndpoint(endpoint, { method: 'post', body: newTask })

      expect(status).toBe(201)
      expect(body).toMatchObject(newTask)
      expect(body).toHaveProperty('_id')
      expect(body).toHaveProperty('createdAt')
      expect(body).toHaveProperty('updatedAt')

      createdTaskId = body._id // We save the id of the created task so we can use it in the next test
    })

    it('Task should exist in the database', async () => {
      const task = await taskModel.findById(createdTaskId)

      expect(task).toMatchObject(newTask)
    })
  })
})