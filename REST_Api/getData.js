// ---------------------------------working---------------------------------
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

exports.handler = function (e, ctx, callback) {
  let params = {
    TableName: "users",
    Limit: 100,
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
};

// ---------------------------------query---------------------------------
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
});

var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function (e, ctx, callback) {
  console.log("Querying.");

  var params = {
    TableName: "users",
    KeyConditionExpression: "#yr = :yyyy",
    ExpressionAttributeNames: {
      "#yr": "email_id",
    },
    ExpressionAttributeValues: {
      ":yyyy": "dubey@yash.com",
    },
  };

  docClient.query(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Query succeeded.");
      data.Items.forEach(function (item) {
        console.log("item:- ", item);
      });
      callback(null, data.Items);
    }
  });
};
