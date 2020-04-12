const express = require("express");
const mongo = require("mongodb");
const app = express();
app.use(express.json());

// Url for mongodb
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  const db = client.db("activity1");

  //printing all the collections in my database
  db.listCollections()
    .toArray()
    .then(docs => {
      console.log("Available collections:");
      docs.forEach((doc, idx, array) => {
        console.log(doc.name);
      });
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      client.close();
    });
});

//printing all documents for accountInfo collection
app.get("/api/account", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    dbo
      .collection("accountInfo")
      .find(
        {},
        {
          projection: {
            _id: 0,
            accountType: 1,
            accountDuration: 1,
            amountDeposited: 1,
            idsSuspended: 1,
            accountOpenDate: 1
          }
        }
      )
      .toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        db.close();
      });
  });
});

//printing all documents for contactInfo collection
app.get("/api/contact", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    dbo
      .collection("contactInfo")
      .find(
        {},
        {
          projection: {
            _id: 0,
            phoneNumber1: 1,
            phoneNumber2: 1,
            homeTel: 1,
            emailId: 1,
            fax: 1,
            linkedIn: 1
          }
        }
      )
      .toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        db.close();
      });
  });
});

//printing documents with parameters from customerInfo collection

app.get("/api/customerInfo/:accountId", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    dbo.listCollections({ nameOnly: true }).toArray((err, result) => {
      console.log(result);
    });
    dbo
      .collection("customerInfo")
      .findOne(
        { accountId: +req.params.accountId },
        {
          projection: {
            _id: 0,
            accountHolderFirstName: 1,
            accountHolderMiddleName: 1,
            accountHolderLastName: 1
          }
        }
      )
      .then(value => res.json(value));
  });
});

//printing documents with parameters from balanceInfo collection which have a definit balance On hand

app.get("/api/balanceInfo/:accountBlncOnHand", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    dbo.listCollections({ nameOnly: true }).toArray((err, result) => {
      console.log(result);
    });
    dbo
      .collection("balanceInfo")
      .findOne(
        { accountBlncOnHand: req.params.accountBlncOnHand },
        {
          projection: {
            _id: 0,
            amountWithdrawed: 1
          }
        }
      )
      .then(value => res.json(value));
  });
});

//Adding a new document using post service
app.post("/api/addAccount", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    var myobj = { accountType: "Chequing", accountOpenDate: "02/02/2017" };
    dbo.collection("accountInfo").insertOne(myobj, function(err, result) {
      if (err) throw err;
      console.log(result);
      console.log("1 document inserted into account collection");
      res.status(200);
      res.send(result.ops);
      db.close();
    });
  });
});

//Adding a new document using post service in customerInfo
app.post("/api/addCustomer", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    var myobj = {
      accountHolderFirstName: "Raman",
      accountHolderMiddleName: "Preet",
      accountHolderLastName: "Singh"
    };
    dbo.collection("customerInfo").insertOne(myobj, function(err, result) {
      if (err) throw err;
      console.log(result);
      console.log("1 customer inserted");
      res.status(200);
      res.send(result.ops);
      db.close();
    });
  });
});

//Updating a document in confidentialInfo
app.put("/api/UpdateConfidentialInfo", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    var myQuery = { beneficiary: "Christ" };
    var newValues = { $set: { witness: "Amardeep" } };
    dbo
      .collection("confidentialInfo")
      .updateOne(myQuery, newValues, function(err, result) {
        if (err) throw err;
        console.log("1 document updated!!!");
        res.send(result);
        db.close();
      });
  });
});

//Updating a document in customerInfo
app.put("/api/UpdateCustomerInfo", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    var myQuery = { accountId: +105 };
    var newValues = { $set: { accountHolderFirstName: "Amardeep" } };
    dbo
      .collection("customerInfo")
      .updateOne(myQuery, newValues, function(err, result) {
        if (err) throw err;
        console.log("1 document updated!!!");
        res.send(result);
        db.close();
      });
  });
});

//Delete one document from previousInfo
app.delete("/api/deleteOneDocument", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    var myquery = { Id: "105" };
    dbo.collection("previousInfo").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
});

//Delete one document from creditInfo
app.delete("/api/deletecredits", (req, res) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("activity1");
    var myquery = { creditCardBank: "BMO" };
    dbo.collection("creditInfo").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
});

//port environment variable
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
