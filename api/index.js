import express from 'express';
import testRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.route.js"
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

mongoose.connect(process.env.MONGODB).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Failed to connect to MongoDB",err);
});

const app = express();
app.listen(3000, ()=>{
    console.log("Server is running on http://localhost:3000");
})

app.use(express.json());
app.use("/api",testRoutes);
app.use("/api/auth",authRoutes);

app.get('/',(req,res)=> {
    res.send('Hello World');
});