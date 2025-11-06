import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
    });

    // await mongoose.connect("mongodb+srv://mern-project:RWbMLcN3jdAhpvWf@cluster0.eiuujei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    // For online database connection
    await mongoose.connect("mongodb://localhost:27017/UsersDB");
    // For offline database connection

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;