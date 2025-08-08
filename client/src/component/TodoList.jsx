import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [filter, setFilter] = useState('All');

  const today = new Date().toISOString().split('T')[0];

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      if (response.data && Array.isArray(response.data.todos)) {
        setTodos(response.data.todos);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return toast.error("Task title is required.");
    if (!newTodoDueDate) return toast.error("Due date is required.");

    try {
      const response = await axios.post(`${API_URL}/todos`, {
        title: newTodoTitle,
        description: newTodoDescription,
        dueDate: newTodoDueDate,
      });

      if (response.data && response.data.todo) {
        setTodos([...todos, response.data.todo].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
        toast.success("Task added successfully!");
      }
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoDueDate('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add task.";
      toast.error(errorMessage);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, {
        status: newStatus,
      });
      setTodos(todos.map(todo =>
        todo._id === id ? response.data.todo : todo
      ));
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update status.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
 setTodos(todos.filter(todo => todo._id !== id));
      toast.info("Task deleted.");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete task.";
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'All') return true;
    return todo.status === filter;
  });

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <h1 className="mb-8 text-4xl font-bold text-center text-white">My Project Planner</h1>

      {/* --- UPDATED FORM LAYOUT --- */}
      <form onSubmit={handleCreateTodo} className="grid grid-cols-1 gap-4 p-4 mb-8 bg-gray-800 rounded-lg sm:grid-cols-2">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="New Task Title..."
          className="p-2 text-white bg-gray-700 border border-gray-600 rounded sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          placeholder="Description..."
          rows="2"
          className="p-2 text-white bg-gray-700 border border-gray-600 rounded sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={newTodoDueDate}
          onChange={(e) => setNewTodoDueDate(e.target.value)}
          min={today}
          className="p-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 font-semibold text-white transition bg-blue-600 rounded cursor-pointer hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {/* --- RESPONSIVE FILTER CONTROLS --- */}
      <div className="mb-8">
        {/* Dropdown for Mobile */}
        <div className="sm:hidden">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 text-white bg-gray-700 border border-gray-600 rounded"
          >
            <option>All</option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Buttons for Desktop */}
        <div className="justify-center hidden gap-4 sm:flex ">
          <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-md cursor-pointer ${filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>All</button>
          <button onClick={() => setFilter('Not Started')} className={`px-4 py-2 rounded-md cursor-pointer ${filter === 'Not Started' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Not Started</button>
          <button onClick={() => setFilter('In Progress')} className={`px-4 py-2 rounded-md cursor-pointer ${filter === 'In Progress' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>In Progress</button>
          <button onClick={() => setFilter('Completed')} className={`px-4 py-2 rounded-md cursor-pointer ${filter === 'Completed' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Completed</button>
        </div>
      </div>
      {/* --- END OF CONTROLS --- */}


      <div className="space-y-4">
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <TaskCard key={todo._id} todo={todo} onStatusChange={handleStatusChange} onDelete={handleDeleteTodo} formatDate={formatDate} />
          ))
        ) : (
          <p className="text-center text-gray-400">No tasks found for this status.</p>
        )}
      </div>
    </div>
  );
};

// --- REDESIGNED & RESPONSIVE TASK CARD COMPONENT ---
const TaskCard = ({ todo, onStatusChange, onDelete, formatDate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return 'border-l-4 border-gray-500';
      case 'In Progress': return 'border-l-4 border-yellow-500';
      case 'Completed': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-lg text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${getStatusColor(todo.status)}`}>
      <div className="flex-grow">
        <h3 className={`font-bold ${todo.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>{todo.title}</h3>
        {todo.description && <p className={`text-sm text-gray-400 mt-1 ${todo.status === 'Completed' ? 'line-through' : ''}`}>{todo.description}</p>}
      </div>

      <div className="flex items-center self-end gap-4 sm:self-center">
        <span className="text-xs text-gray-400 whitespace-nowrap">Due: {formatDate(todo.dueDate)}</span>
        <select value={todo.status} onChange={(e) => onStatusChange(todo._id, e.target.value)} className="p-1 text-xs bg-gray-700 border border-gray-600 rounded cursor-pointer focus:outline-none">
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <button onClick={() => onDelete(todo._id)} className="text-gray-400 transition-colors cursor-pointer hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
};

export default TodoList;
