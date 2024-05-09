import mongoose from 'mongoose';

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);

        console.log(`DATABASE is connect to ${conn.connection.host}`);

    } catch (error) {
        
        console.log('failed to connect to database :', error);
    }

}

export default connectDB;