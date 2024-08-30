import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Todo {
  id: number;
  title: string;
  description: string;
  datetime: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (todo: Todo) => void;
  editTodo: (updatedTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  toggleComplete: (id: number) => void;
  filter: "all" | "completed" | "pending";
  setFilter: (filter: "all" | "completed" | "pending") => void;
  sortBy: "date" | "alphabetical";
  setSortBy: (sortBy: "date" | "alphabetical") => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      filter: "all",
      sortBy: "date",
      addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
      editTodo: (updatedTodo) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === updatedTodo.id ? updatedTodo : todo
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      toggleComplete: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      setFilter: (filter) => set({ filter }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    {
      name: "todo-storage",
    }
  )
);
