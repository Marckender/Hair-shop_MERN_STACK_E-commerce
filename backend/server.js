const app =  require("./app");

const dotenv =  require("dotenv");
const connectDatabase = require("./db/Database.js");

// Config
dotenv.config({
    path: "config/.env"
});

//connection
connectDatabase();

// create Server
const server = app.listen(process.env.PORT, () => {
    console.log(`THE SERVER IS WORKING ON http://localhost:${process.env.PORT}`);
});