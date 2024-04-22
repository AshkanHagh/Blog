import express from 'express';
import cookieParser from 'cookie-parser';

import connectDB from './db/connectDB';

import userRoute from './routes/user.route';


const app = express();
connectDB();

const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoute);


app.listen(PORT, () => console.log(`server is running on port ${PORT}`));