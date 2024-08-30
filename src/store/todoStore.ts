import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the structure of a Todo item
interface Todo {
  id: number;
  title: string;
  description: string;
  datetime: string;
  completed: boolean;
}

// Define the shape of the Zustand store for Todos
interface TodoStore {
  todos: Todo[];
  filter: "all" | "completed" | "pending";
  sortBy: "date" | "alphabetical";
  addTodo: (todo: Todo) => void;
  editTodo: (updatedTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  toggleComplete: (id: number) => void;
  setFilter: (filter: "all" | "completed" | "pending") => void;
  setSortBy: (sortBy: "date" | "alphabetical") => void;
}

// Zustand store with persistence to localStorage
export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      // Initial state: an empty array of todos
      todos: [],
      // Default filter set to 'all' (show all todos)
      filter: "all",
      // Default sorting method is alphabetical
      sortBy: "alphabetical",

      /**
       * Adds a new todo item to the store.
       * @param {Todo} todo - The new todo item to add.
       */
      addTodo: (todo) =>
        set((state) => ({
          todos: [...state.todos, todo], // Add new todo to the existing array of todos
        })),

      /**
       * Edits an existing todo item in the store.
       * @param {Todo} updatedTodo - The todo item with updated details.
       */
      editTodo: (updatedTodo) =>
        set((state) => ({
          todos: state.todos.map(
            (todo) => (todo.id === updatedTodo.id ? updatedTodo : todo) // Replace the old todo with the updated one
          ),
        })),

      /**
       * Deletes a todo item from the store based on its ID.
       * @param {number} id - The ID of the todo to delete.
       */
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id), // Remove the todo by filtering it out
        })),

      /**
       * Toggles the completion status of a todo item.
       * @param {number} id - The ID of the todo item to toggle.
       */
      toggleComplete: (id) =>
        set((state) => ({
          todos: state.todos.map(
            (todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo // Toggle completed status
          ),
        })),

      /**
       * Sets the current filter for displaying todos.
       * @param {'all' | 'completed' | 'pending'} filter - The filter type to set.
       */
      setFilter: (filter) =>
        set(() => ({
          filter, // Set the filter (e.g., 'all', 'completed', 'pending')
        })),

      /**
       * Sets the sorting method for the todo list.
       * @param {'date' | 'alphabetical'} sortBy - The sorting criteria to set.
       */
      setSortBy: (sortBy) =>
        set(() => ({
          sortBy, // Set the sorting method (e.g., 'date' or 'alphabetical')
        })),
    }),
    {
      name: "todo-storage", // Name of the localStorage key
      getStorage: () => localStorage, // Persist using localStorage
    }
  )
);
