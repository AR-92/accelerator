import databaseService from '../services/supabase.js';

class Todo {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.completed = data.completed || false;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const todos = await databaseService.getAllTodos();
    return todos.map(todo => new Todo(todo));
  }

  static async findById(id) {
    const todos = await databaseService.getAllTodos();
    const todo = todos.find(todo => todo.id === parseInt(id));
    return todo ? new Todo(todo) : null;
  }

  static async create(data) {
    const todoData = await databaseService.createTodo(data.title, data.description);
    return new Todo(todoData);
  }

  async update(updates) {
    const updatedTodo = await databaseService.updateTodo(this.id, updates);
    Object.assign(this, updatedTodo);
    return this;
  }

  async delete() {
    await databaseService.deleteTodo(this.id);
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export default Todo;