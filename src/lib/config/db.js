import mongoose from "mongoose";

const connections = {};

export const connectDB = async (dbName = "KojiHQ") => {
  if (connections[dbName]) {
    return connections[dbName];
  }

  const MONGO_URI = `mongodb+srv://pythoncux:pythoncux@cluster0.tl7krxg.mongodb.net/${dbName}`;

  try {
    mongoose.set("strictQuery", true);
    const newConnection = await mongoose.createConnection(MONGO_URI);

    connections[dbName] = newConnection;
    return newConnection;
  } catch (error) {
    console.error(`Error connecting to database ${dbName}:`, error);
    process.exit(1);
  }
};
