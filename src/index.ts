import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import config from "./config/config";
import feeRoutes from "./routes/feeRoutes";
import { stopProcess } from "./service/eventService";

const app = express();
const PORT = config.apiPort;

app.use(bodyParser.json())

// Register routes
app.use("/api", feeRoutes);

// Connect to MongoDB
mongoose.connect(config.mongoDbUri).then(() => {
  console.info("MongoDB is connected");

  // Start the Server
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
process.on('SIGINT', function() {
  stopProcess().then(() => {
    console.log("Exiting Application .............");
    process.exit(0);
  });
}); //CTRL+C

process.on('SIGQUIT', () => {
  stopProcess().then(() => {
    console.log("Exiting Application .............");
    process.exit(0);
  });
}); // Keyboard quit
process.on('SIGTERM', () => {
  stopProcess().then(() => {
    console.log("Exiting Application .............");
    process.exit(0);
  });
}); // `kill` command