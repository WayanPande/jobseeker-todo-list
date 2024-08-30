import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { useTodoStore } from "./store/todoStore";
import Plus from "./assets/plus";
import Pen from "./assets/pen";
import Trash from "./assets/trash";
import Search from "./assets/search";
import EmptyStateImg from "./assets/empty-state.png";

function App() {
  const {
    todos,
    addTodo,
    editTodo,
    deleteTodo,
    toggleComplete,
    filter,
    setFilter,
    sortBy,
    setSortBy,
  } = useTodoStore();
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Toggle between dark and light mode
  useEffect(() => {
    const storedTheme = localStorage.getItem("jobseeker-todo-list-theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("jobseeker-todo-list-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("jobseeker-todo-list-theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  const handleAddTodo = () => {
    const todo = {
      id: Date.now(),
      title: newTodo.title,
      description: newTodo.description,
      datetime: new Date().toLocaleString(),
      completed: false,
    };
    addTodo(todo);
    setNewTodo({ title: "", description: "" });
    setShowModal(false); // Close modal
  };

  const handleEditTodo = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setNewTodo({ title: todo.title, description: todo.description });
      setSelectedTodoId(id);
      setShowModal(true); // Open modal for editing
    }
  };

  const handleUpdateTodo = () => {
    if (selectedTodoId !== null) {
      editTodo({
        id: selectedTodoId,
        ...newTodo,
        completed: false,
        datetime: new Date().toLocaleString(),
      });
      setSelectedTodoId(null);
      setNewTodo({ title: "", description: "" });
      setShowModal(false); // Close modal
    }
  };

  const filteredAndSearchedTodos = useMemo(
    () =>
      todos
        // Step 1: Filter todos based on status
        .filter((todo) => {
          if (filter === "completed") return todo.completed;
          if (filter === "pending") return !todo.completed;
          return true; // 'all' case
        })
        // Step 2: Apply search logic on the filtered result
        .filter((todo) => {
          if (searchTerm === "") return true; // No search, return all
          return (
            todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            todo.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
        // Step 3: Sort the todos
        .sort((a, b) => {
          if (sortBy === "date")
            return new Date(a.datetime) > new Date(b.datetime) ? 1 : -1;
          if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
          return 0;
        }),
    [todos, filter, searchTerm, sortBy]
  );

  return (
    <main className="dark:bg-darkBg dark:text-white">
      <section className="p-4 min-h-screen max-w-lg mx-auto relative flex flex-col py-10">
        <h1 className="text-center text-3xl font-bold mb-6">TODO LIST</h1>

        {/* Search and Filter */}
        <div className="flex items-center mb-4 gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              className="border p-2 w-full rounded-lg shadow-sm focus:outline-none border-primary focus:ring-1 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-300 dark:bg-darkBg dark:text-white"
              placeholder="Search todo..."
              value={searchTerm}
              // if the data is accessed from a DB or something, i should debounce this value input
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute top-2 right-2 text-primary bg-white dark:bg-darkBg dark:text-white">
              <Search />
            </div>
          </div>
          <select
            className="border p-2 rounded-lg shadow-sm bg-primary text-white"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "completed" | "pending")
            }
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          {/* Dark Mode Toggle */}
          <button
            className="border p-2 rounded-lg shadow-sm bg-primary text-white"
            onClick={toggleDarkMode}
          >
            {!darkMode ? "🌙" : "🌞"}
          </button>
        </div>

        {/* Sort Controls */}
        <div className="inline-flex rounded-md shadow-sm mx-auto">
          <button
            type="button"
            onClick={() => setSortBy("date")}
            className={`${
              sortBy === "date" ? "!text-primary ring-2 !ring-primary z-10" : ""
            } px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-2 focus:ring-primary focus:text-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-primary dark:focus:text-white`}
          >
            Sort by Last Updated
          </button>
          <button
            type="button"
            onClick={() => setSortBy("alphabetical")}
            className={`${
              sortBy === "alphabetical"
                ? "!text-primary ring-2 !ring-primary z-10"
                : ""
            } px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-primary focus:z-10 focus:ring-2 focus:ring-primary focus:text-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-primary dark:focus:text-white`}
          >
            Sort Alphabetically
          </button>
        </div>

        {/* Todo List */}
        <ul className="divide-y divide-primary">
          {filteredAndSearchedTodos.length === 0 ? (
            <div className="mt-16 space-y-3">
              <img src={EmptyStateImg} alt="Empty State" className="mx-auto" />
              <p className="text-center text-gray-500">
                You haven't added any todos yet.
              </p>
            </div>
          ) : null}
          {filteredAndSearchedTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 mb-5 relative"
            >
              <div className="flex items-center overflow-hidden gap-3">
                <input
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  id="checked-checkbox"
                  type="checkbox"
                  value=""
                  className="w-5 h-5 text-primary bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-primary dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 flex-2"
                />
                <span
                  className={`text-lg text-ellipsis overflow-hidden pr-10 flex-1 ${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.title}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditTodo(todo.id)}
                  className="hover:text-blue-500 text-gray-300"
                >
                  <Pen />
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setSelectedTodoId(todo.id);
                  }}
                  className="hover:text-red-500 text-gray-300"
                >
                  <Trash />
                </button>
              </div>
              <span className="text-gray-500 text-xs absolute -bottom-2">
                Last Updated: {new Date(todo.datetime).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>

        {/* Floating Action Button (FAB) */}
        <button
          className="fixed bottom-8 right-4 md:right-[15%] lg:right-1/4 xl:right-1/3 bg-blue-500 text-white p-4 rounded-full shadow-lg"
          onClick={() => {
            setShowModal(true);
            setNewTodo({ title: "", description: "" });
            setSelectedTodoId(null);
          }}
        >
          <Plus />
        </button>

        {/* Add & Edit Todo Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full dark:bg-darkBg dark:ring-gray-300 dark:ring-1">
              <h2 className="text-xl mb-4">
                {selectedTodoId ? "Edit Todo" : "Add Todo"}
              </h2>
              <input
                type="text"
                className="border p-2 w-full mb-2 rounded-lg dark:border-gray-300 dark:bg-darkBg dark:text-white"
                placeholder="Title"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
              />
              <textarea
                className="border p-2 w-full mb-2 rounded-lg dark:border-gray-300 dark:bg-darkBg dark:text-white"
                placeholder="Description"
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
              />

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedTodoId ? handleUpdateTodo : handleAddTodo}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  {selectedTodoId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Todo Modal */}
        {showDeleteModal && selectedTodoId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full dark:bg-darkBg dark:ring-gray-300 dark:ring-1">
              <h2 className="text-xl mb-4">Delete Todo</h2>
              <p className="text-gray-500 dark:text-gray-300">
                Are you sure you want to delete this todo?
              </p>
              <div className="flex justify-end space-x-2 mt-5">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteTodo(selectedTodoId);
                    setShowDeleteModal(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  disabled={selectedTodoId === null}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
