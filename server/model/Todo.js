import mongoose from "mongoose";
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'], 
        default: 'Not Started',
    },
    dueDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true });
const Todo = mongoose.model("Todo", todoSchema);
export default Todo;