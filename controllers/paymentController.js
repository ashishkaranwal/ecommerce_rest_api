const https = require('https');
const jwt = require("jsonwebtoken");

const Paytm = require('paytm-pg-node-sdk');


// For Staging 
//var environment = Paytm.LibraryConstants.STAGING_ENVIRONMENT;

// For Production 
 var environment = Paytm.LibraryConstants.PRODUCTION_ENVIRONMENT;

// Find your mid, key, website in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
var mid = process.env.MID;
var key = process.env.MKEY;
var website = process.env.WEBSITE;
var client_id = "WAP";
var callbackUrl = process.env.LOCAL_CALLBACK;

Paytm.MerchantProperties.setCallbackUrl(callbackUrl);

Paytm.MerchantProperties.initialize(environment, mid, key, client_id, website);
// If you want to add log file to your project, use below code
Paytm.Config.logName = "[PAYTM]";
Paytm.Config.logLevel = Paytm.LoggingUtil.LogLevel.INFO;
Paytm.Config.logfile = "../paytm/log/logs.log";



exports.createTrxnToken= async(req,res)=>{

var orderId="ORDERID_"+Date.now();

const token = req.header("auth-token");
const decodedToken = jwt.decode(token);
console.log("ID -- "+decodedToken._id);

var channelId = Paytm.EChannelId.WEB;
var txnAmount = Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, req.body.amount);
var userInfo = new Paytm.UserInfo(decodedToken._id); 
userInfo.setAddress(req.body.address);
userInfo.setEmail(req.body.email);
userInfo.setFirstName(req.body.firstname);
userInfo.setLastName(req.body.lastname);
userInfo.setMobile(req.body.phone);
userInfo.setPincode(req.body.pincode);
var paymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo);
var paymentDetail = paymentDetailBuilder.build();

 Paytm.Payment.createTxnToken(paymentDetail).then(function (response) {

    if (response instanceof Paytm.SDKResponse) {

        var respBody=response.getJsonResponse();

       var json=JSON.parse(respBody);
        console.log(json["body"]["txnToken"]);

        var result={
            'token': json["body"]["txnToken"],
            'orderId': orderId
        };
        return res.status(200).send({code:200, message: "Sucesss", data: result});
    }
    else{
        var respBody=response.getResponseObject();
        console.log(respBody);
        return res.status(400).send({code:400, message: "No response", data: null});
    }

});


}









exports.getPaymentStaus=async(req,res)=>{
var orderId = req.body.orderId;
var readTimeout = 80000;
var paymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(orderId);
var paymentStatusDetail = paymentStatusDetailBuilder.setReadTimeout(readTimeout).build();

 Paytm.Payment.getPaymentStatus(paymentStatusDetail).then(function (response) {
    if (response instanceof Paytm.SDKResponse) {
       


        var respBody=response.getJsonResponse();

        var json=JSON.parse(respBody);

         console.log(response);
 
         var result={
             'resultInfo': json["body"]["resultInfo"],
             'orderId': orderId
         };
         return res.status(200).send({code:200, message: "Sucesss", data: result});
    }
    else{
        var respBody=response.getResponseObject();
        console.log(respBody);
        return res.status(400).send({code:400, message: "No data", data: null});
    }
});

}