import request from 'supertest';
import app from '../../src/app.js';
import databaseService from '../../src/services/supabase.js';

describe('Todos API', () => {
  const mockTodo = {
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

  describe('GET /api/todos', () => {
    it('should return all todos as JSON', async () => {
      databaseService.getAllTodos.mockResolvedValue([mockTodo]);

      const response = await request(app)
        .get('/api/todos')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([mockTodo]);
    });

    it('should return todos as HTML for HTMX requests', async () => {
      databaseService.getAllTodos.mockResolvedValue([mockTodo]);

      const response = await request(app)
        .get('/api/todos')
        .set('HX-Request', 'true')
        .expect('Content-Type', /html/)
        .expect(200);

      expect(response.text).toContain('Test Todo');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const newTodo = { title: 'New Todo', description: 'New Description' };
      databaseService.createTodo.mockResolvedValue(mockTodo);

      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTodo);
    });

    it('should validate required title field', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ description: 'No title' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should return alert HTML for HTMX requests', async () => {
      const newTodo = { title: 'New Todo' };
      databaseService.createTodo.mockResolvedValue(mockTodo);

      const response = await request(app)
        .post('/api/todos')
        .set('HX-Request', 'true')
        .send(newTodo)
        .expect('Content-Type', /html/)
        .expect(200);

      expect(response.text).toContain('Todo created successfully');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const updates = { completed: true };
      const updatedTodo = { ...mockTodo, completed: true };

      databaseService.getAllTodos.mockResolvedValue([mockTodo]);
      databaseService.updateTodo.mockResolvedValue(updatedTodo);

      const response = await request(app)
        .put('/api/todos/1')
        .send(updates)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      databaseService.getAllTodos.mockResolvedValue([]);

      const response = await request(app)
        .put('/api/todos/999')
        .send({ completed: true })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Todo not found');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      databaseService.getAllTodos.mockResolvedValue([mockTodo]);
      databaseService.deleteTodo.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/todos/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Todo deleted successfully');
    });

    it('should return 404 for non-existent todo', async () => {
      databaseService.getAllTodos.mockResolvedValue([]);

      const response = await request(app)
        .delete('/api/todos/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Todo not found');
    });
  });
});