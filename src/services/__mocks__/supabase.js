const mockDatabaseService = {
  getAllTodos: jest.fn(),
  createTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
};

export default mockDatabaseService;