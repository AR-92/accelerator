import Todo from '../../src/models/Todo.js';
import databaseService from '../../src/services/supabase.js';

describe('Todo Model', () => {
  const mockTodoData = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a Todo instance with correct properties', () => {
      const todo = new Todo(mockTodoData);

      expect(todo.id).toBe(mockTodoData.id);
      expect(todo.title).toBe(mockTodoData.title);
      expect(todo.description).toBe(mockTodoData.description);
      expect(todo.completed).toBe(mockTodoData.completed);
      expect(todo.created_at).toBe(mockTodoData.created_at);
      expect(todo.updated_at).toBe(mockTodoData.updated_at);
    });
  });

  describe('findAll', () => {
    it('should return all todos', async () => {
      const mockTodos = [mockTodoData];
      databaseService.getAllTodos.mockResolvedValue(mockTodos);

      const todos = await Todo.findAll();

      expect(databaseService.getAllTodos).toHaveBeenCalledTimes(1);
      expect(todos).toEqual(mockTodos);
    });
  });

  describe('findById', () => {
    it('should return todo by id', async () => {
      const mockTodos = [mockTodoData];
      databaseService.getAllTodos.mockResolvedValue(mockTodos);

      const todo = await Todo.findById(1);

      expect(databaseService.getAllTodos).toHaveBeenCalledTimes(1);
      expect(todo).toEqual(mockTodoData);
    });

    it('should return undefined if todo not found', async () => {
      const mockTodos = [mockTodoData];
      databaseService.getAllTodos.mockResolvedValue(mockTodos);

      const todo = await Todo.findById(999);

      expect(todo).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createData = { title: 'New Todo', description: 'New Description' };
      databaseService.createTodo.mockResolvedValue(mockTodoData);

      const todo = await Todo.create(createData);

      expect(databaseService.createTodo).toHaveBeenCalledWith(createData.title, createData.description);
      expect(todo).toBeInstanceOf(Todo);
      expect(todo.id).toBe(mockTodoData.id);
    });
  });

  describe('update', () => {
    it('should update todo and return updated instance', async () => {
      const todo = new Todo(mockTodoData);
      const updates = { completed: true };
      const updatedData = { ...mockTodoData, completed: true };

      databaseService.updateTodo.mockResolvedValue(updatedData);

      const result = await todo.update(updates);

      expect(databaseService.updateTodo).toHaveBeenCalledWith(todo.id, updates);
      expect(result).toBe(todo);
      expect(result.completed).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete todo', async () => {
      const todo = new Todo(mockTodoData);
      databaseService.deleteTodo.mockResolvedValue(true);

      const result = await todo.delete();

      expect(databaseService.deleteTodo).toHaveBeenCalledWith(todo.id);
      expect(result).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('should return plain object representation', () => {
      const todo = new Todo(mockTodoData);
      const json = todo.toJSON();

      expect(json).toEqual(mockTodoData);
      expect(json).not.toBeInstanceOf(Todo);
    });
  });
});