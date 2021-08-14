const { request, response } = require("express");
const express = require("express");

// initialization
const OurAPP = express();

OurAPP.get("/", (request,response) => {
    response.json({message: "Request Served!!!!!!!"});
});

// localhost:3000

OurAPP.listen(4000,() => console.log("server is running"));