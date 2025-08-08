import Todo from "../model/Todo.js"; // Corrected the import path from 'model' to 'models'

export const createTodo = async (req, res) => {
    try {
        // 1. We now look for status and dueDate from the request body as well.
        const { title, description, status, dueDate } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        // 2. We create the new Todo with the new fields.
        const newTodo = new Todo({ title, description, status, dueDate });
        await newTodo.save();
        res.status(201).json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
        res.status(500).json({ message: "Error creating todo", error: error.message });
    }
}

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({}).sort({ dueDate: 1 });
        res.status(200).json({ message: "Todos fetched successfully", todos });
    } catch (error) {
        res.status(500).json({ message: "Error fetching todos", error: error.message });
    }
}

export const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // --- THIS IS THE CORRECTED UPDATE LOGIC ---
        // 3. We now update the title, description, status, and dueDate.
        //    The old 'completed' logic has been removed.
        todo.title = req.body.title || todo.title;
        todo.description = req.body.description || todo.description;
        todo.status = req.body.status || todo.status;
        todo.dueDate = req.body.dueDate || todo.dueDate;
        // --- END OF CORRECTION ---

        const updatedTodo = await todo.save();
        res.status(200).json({ message: "Todo updated successfully", todo: updatedTodo });
    } catch (error) {
        res.status(500).json({ message: "Error updating todo", error: error.message });
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        // Your response here is good, but sending back the deleted todo is optional.
        // A simple success message is also very common.
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo", error: error.message });
    }
}
