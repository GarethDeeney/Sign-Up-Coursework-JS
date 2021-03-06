// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/8a8fbfb3df";

  const options = {
    method: "POST",
    auth: "gareth1:595a974e6bf0c553a0504185f3be85ec-us18"
  };

  const request = https.request(url, options, (response) => {

    const statusCode = response.statusCode;

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });

    if (statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

  });
  request.write(jsonData);
  request.end();

});

app.post("/failure", (req, res) =>{
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on Port 3000");
});


// API Key: 9786741d4a1bf3672f25bf21dd23698c-us18
//595a974e6bf0c553a0504185f3be85ec-us18

// Audience ID: 8a8fbfb3df
