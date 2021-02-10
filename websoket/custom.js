// -------------------------- working----------------------------------------
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();
const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: "7e7vgq6yyf.execute-api.us-east-1.amazonaws.com/production",
});

exports.handler = async (event, context) => {
  try {
    console.log("event : ", JSON.stringify(event));
    var boostFlowObject = {};
    boostFlowObject = event;

    var connectionData = await getConnections(ddb, boostFlowObject);

    connectionData.Items.map(async (item) => {
      await postCalls(
        apigatewaymanagementapi,
        item.connectionid,
        boostFlowObject
      );
    });

    return successResponse(
      "Successfully published data to connections : " +
        JSON.parse(boostFlowObject.body).message
    );
  } catch (e) {
    console.error(e);
    return errorResponse("Not able to publish", 500);
  }
};

//this function is fetching all connectionid currently connected to sokcet
function getConnections(ddb, boostFlowObject) {
  var params = {
    TableName: "chat",
    ProjectionExpression: "connectionid",
    // FilterExpression: "#type=:type and #farm_id = :farm_id",
    // ExpressionAttributeNames: {
    //   "#type": "type",
    //   "#farm_id": "farm_id",
    // },
    // ExpressionAttributeValues: {
    //   ":type": "boost_flow",
    //   ":farm_id": farm_id,
    // },
  };
  return ddb.scan(params).promise();
}

//this function is used to create error response
const errorResponse = (errorMessage, statusCode) => ({
  statusCode: statusCode,
  body: JSON.stringify({
    error_message: errorMessage,
  }),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

//this function is used to create success response
const successResponse = (data) => ({
  statusCode: 200,
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

function postCalls(api, connectionid, boostFlowObject) {
  return api
    .postToConnection({
      ConnectionId: connectionid,
      Data: JSON.stringify(boostFlowObject),
    })
    .promise();
}
