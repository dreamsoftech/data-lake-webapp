var AWS = require('aws-sdk');
var express = require('express');
var app = express();

getQuicksightEmbedUrl = function(quicksight, resetDisabled) {
    quicksight.getDashboardEmbedUrl({
        AwsAccountId: "621087071167",
        DashboardId: "57af81e8-8f97-432e-b6c6-3385809c681f",
        IdentityType: "IAM",
        ResetDisabled: resetDisabled,
        SessionLifetimeInMinutes: 400,
        UndoRedoDisabled: false
    },
    function (err, data) {
        if (!err) {
            console.log(Date());
            console.log(data);
        } else {
            console.log(err);
        }
    });
}
var cognitoidentity = new AWS.CognitoIdentity({region: 'us-east-1'});

var params = {
    IdentityId: 'us-east-1:9414fd81-7a80-4bd5-abd7-78826c21501b', /* required */    
};
cognitoidentity.getCredentialsForIdentity(params, function(err, data) {
    console.log(data);
    if (err) console.log(err, err.stack); // an error occurred
    else {
        AWS.config.update({

            accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken,
            "region": "us-east-1"
        });
        var quicksight = new AWS.QuickSight({apiVersion: '2018-04-01'});

        var params = {
            AwsAccountId: '621087071167',
            Email: 'dreamsoftech88@gmail.com',
            IdentityType: 'IAM', //| QUICKSIGHT, /* required */
            Namespace: 'default',
            UserRole: 'READER', //ADMIN | AUTHOR | READER | RESTRICTED_AUTHOR | RESTRICTED_READER, /* required */
            IamArn: 'arn:aws:iam::621087071167:role/Cognito_QuickSightAuth_Role',
            SessionName: 'dreamsoftech88@gmail.com',
        };
        quicksight.registerUser(params, function (err, data1) {
            if (err) {
                console.log(JSON.stringify(err));
                if (err.statusCode == 409) {
                    getQuicksightEmbedUrl(quicksight, false);
                }
                console.log("err register user ::::::::::::::::::", err, err.stack);
            } // an error occurred
            else {
                console.log("Register User :::::::::::::::: ", data1);
                getQuicksightEmbedUrl(quicksight, true);
            }
        });
    }
});
