const app =  require("./app");

const dotenv =  require("dotenv");
const connectDatabase = require("./db/Database.js");


//Handling uncaught Exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`shutting up the server for Handling uncaught Exception`)
})


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


//Unhandled promise rejesction
process.on("unhandledRejection", (err) => {
    console.log(`shutting down the server for ${err.message}`);
    console.log(`Shutting down the server due to Unhandled promise rejection`);
    server.close(() => {
        process.exit(1)
    })
})