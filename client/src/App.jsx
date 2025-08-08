import React from 'react';
import TodoList from './component/TodoList.jsx';

// 1. Import ToastContainer and its CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-700 via-gray-900 to-black sm:p-8">

      {/* 2. Add the ToastContainer here */}
      <ToastContainer
        position="top-right"
        autoClose={3000} // Shorter time for better UX
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="dark"
      />

      <TodoList />
    </div>
  );
}

export default App;
