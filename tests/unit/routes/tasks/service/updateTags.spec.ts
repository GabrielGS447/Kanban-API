import { TasksService } from "../../../../../src/routes/tasks/Service"
import { MockTasksRepository } from "../../../../__mocks__"

const mockTasksRepository = new MockTasksRepository()
const taskService = new TasksService(mockTasksRepository)

const fakeUpdatedTask = {
  _id: '1',
  boardId: 1,
  status: 'in_progress',
  title: 'test',
  description: 'test',
  priority: 1,
  members: [],
  tags: []
}

describe("TasksService updateTags method unit tests", () => {
  beforeAll(() => { // mock the return value of the tasksRepository.updateTags method
    mockTasksRepository.updateTags = jest.fn().mockResolvedValue(fakeUpdatedTask)
  })

  it("should call the updateTags method of the repository with id, operation and value", async () => {
    await taskService.updateTags('1', 1, 'test')

    expect(mockTasksRepository.updateTags).toHaveBeenCalledWith('1', 1, 'test')
  })

  it("should return the result of the repository's updateTags method", async () => {
    const result = await taskService.updateTags('1', 1, 'test')

    expect(result).toEqual(fakeUpdatedTask)
  })
})