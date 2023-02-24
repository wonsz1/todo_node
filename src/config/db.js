import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const mongoUrl = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
});