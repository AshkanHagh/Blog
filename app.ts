import express, {type Express } from 'express';
import cookieParser from 'cookie-parser';

import connectDB from './db/connectDB';

import userRoute from './routes/user.route';
import postRoute from './routes/post.route';
import publishRoute from './routes/publish.route';
import commentRoute from './routes/comment.route';


const app : Express = express();
connectDB();

const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/publish', publishRoute);
app.use('/api/comment', commentRoute);


app.listen(PORT, () : void => console.log(`server is running on port ${PORT}`));