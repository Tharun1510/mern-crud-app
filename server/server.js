import express from 'express';
import todoRoutes from './routes/todoRoutes.js';
import connectDB from './config/db.js';
import cors from 'cors';
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', todoRoutes);
const PORT = 4000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
