import dotenv from 'dotenv';

dotenv.config();

export default {
  mongoDbUri: process.env.MONGODB_URL || "mongodb://localhost:27017/fee_collector",
  apiPort: process.env.PORT || 3000,
};
