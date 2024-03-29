import mongoose from "mongoose";

const connection = {}; // For storing connection reference

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "chatwithpdf",
  });

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
