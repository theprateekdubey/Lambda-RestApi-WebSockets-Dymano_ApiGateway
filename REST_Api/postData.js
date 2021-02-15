// --------------------------------(Working) -------------------------------------
var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
});
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function (event, ctx, callback) {
  var requestBody;
  requestBody = JSON.parse(event.body);
  var date = new Date();

  var params = {
    TableName: "users",
    Item: {
      email_id: requestBody.email_id,
      msg_timestamp: date.getTime(),
      message: requestBody.message,
    },
  };

  docClient.put(params, function (err, data) {
    if (err) {
      if (params.TableName != "users") {
        callback(null, { body: JSON.stringify("Table Not Found") });
      }

      if (!params.Item.email_id) {
        callback(null, {
          body: JSON.stringify("The email id cannot contain an empty value"),
        });
      }
      callback(null, { body: JSON.stringify(err) });
    } else {
      callback(null, { body: JSON.stringify("Data Added Successfully") });
    }
  });
};

// -----------------------------With Exp Handling----------------------------------------------
var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-1",
});
var db = new AWS.DynamoDB.DocumentClient();

exports.handler =  function (event,ctx,callback) {
    var requestBody;
    try {
        /* code */
        requestBody =JSON.parse(event.body);
    } catch (e) {
        requestBody =JSON.parse(event.body);
    }
    
    var date = new Date();

var params = {
    TableName:"users",
    Item:{
        "email_id": requestBody.email_id,
        "msg_timestamp": date.getTime() ,
        "message": requestBody.message,
    }
  };
  
if (params.TableName =='users') {
      authAttributes(params,callback,requestBody);  
}else{
      callback(null, { body: JSON.stringify("Table Not Found")});
     }
};

function authAttributes(params,callback,requestBody) {
    if (requestBody !== '{}') {
        if (!params.Item.email_id) { 
            return callback(null,{ body: JSON.stringify("The email id cannot contain an empty value")});
        }
        if (!params.Item.message) { 
            return callback(null,{ body: JSON.stringify("The message cannot contain an empty value")});
        }
    }     
    return postData(params ,callback);     
}

function postData(params,callback){
    db.put(params, function(err, data) {
        if (err) {
            callback(null, { body: JSON.stringify(err)});
        } else {
            console.log('data : ',data);
            callback(null,{ statusCode: 200, body: JSON.stringify("Data Added Successfully")});
        }
    });
}
// -------------------------------------------------------------------------------------------
