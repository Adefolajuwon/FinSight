import dotenv from "dotenv";
dotenv.config();
// const IN_DEV = process.env.NODE_ENV === "development";

const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:4000",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  };
  export default env;
