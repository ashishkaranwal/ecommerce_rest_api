const https = require('https');
const jwt = require("jsonwebtoken");
const Paytm = require('paytm-pg-node-sdk');
const orderController = require("../controllers/orderController");




// For Staging 
//var environment = Paytm.LibraryConstants.STAGING_ENVIRONMENT;
const mode=process.env.NODE_ENV;

// For Production 
 var environment = (mode=="debug")?Paytm.LibraryConstants.STAGING_ENVIRONMENT:Paytm.LibraryConstants.PRODUCTION_ENVIRONMENT;

// Find your mid, key, website in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 

var mid = (mode=="debug"?process.env.TMID:process.env.MID);
var key = (mode=="debug"?process.env.TMKEY:process.env.MKEY);
var website =  (mode=="debug"?process.env.TWEBSITE:process.env.WEBSITE);
var client_id = "WAP";
var callbackUrl = (mode=="debug"?process.env.LOCAL_HOST:process.env.REMOTE_HOST)+process.env.PAYTM_CALLBACK_ENDPOINT;

Paytm.MerchantProperties.setCallbackUrl(callbackUrl);

Paytm.MerchantProperties.initialize(environment, mid, key, client_id, website);
// If you want to add log file to your project, use below code
Paytm.Config.logName = "[PAYTM]";
Paytm.Config.logLevel = Paytm.LoggingUtil.LogLevel.INFO;
Paytm.Config.logfile = "../paytm/log/logs.log";





exports.createTrxnToken= async(payload)=>{

var channelId = Paytm.EChannelId.WEB;
var txnAmount = Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, payload.amount);

var userInfo = new Paytm.UserInfo(payload.ownerId); 

console.log(mode);
console.log(website);
console.log(mid);
console.log(key);
console.log(payload);

userInfo.setAddress(payload.address);
userInfo.setEmail(payload.email);
userInfo.setFirstName(payload.firstname);
userInfo.setLastName(payload.lastname);
userInfo.setMobile(payload.phone);
userInfo.setPincode(payload.pincode);

var paymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, payload.orderId, txnAmount, userInfo);
var paymentDetail = paymentDetailBuilder.build();

return Paytm.Payment.createTxnToken(paymentDetail).then(async function (response) {

    if (response instanceof Paytm.SDKResponse) {
        var respBody=response.getJsonResponse();

        var json=JSON.parse(respBody);
        console.log(json["body"]["txnToken"]);
        return json["body"]["txnToken"];
    }
    else{
        var respBody=response.getResponseObject();
        console.log(respBody);
    }

});


}




// exports.getPaymentStaus=async(orderId)=>{

// var readTimeout = 80000;
// var paymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(orderId);
// var paymentStatusDetail = paymentStatusDetailBuilder.setReadTimeout(readTimeout).build();

//  return Paytm.Payment.getPaymentStatus(paymentStatusDetail).then(function (response) {
  
//     if (response instanceof Paytm.SDKResponse) {
       
//         var respBody=response.getJsonResponse();

//         console.log(respBody);

//         var json=JSON.parse(respBody);

//         console.log("Parsed JSON response"+json);
       
 
//          var result={
//              'resultInfo': json["body"]["resultInfo"],
//              'orderId': orderId
//          };

    
//          return result;
//     }
//     else{
//         var respBody=response.getResponseObject();
//         console.log(respBody);
//         // return res.status(400).send({code:400, message: "No data", data: null});
//     }
// });

// }


exports.paytmCallback=async(req,res)=>{
    var orderId = req.body.ORDERID;
    var pgPaymentStatus = req.body.STATUS;
    var pgPaymentMsg=req.body.RESPMSG;

         console.log("Paytm Response -> "+ pgPaymentStatus);

            var paymentStatus= (pgPaymentStatus="TXN_SUCCESS")? 
                               "Completed": 
                               (pgPaymentStatus="TXN_FAILED")? 
                               "Failed":
                               (pgPaymentStatus="PENDING")? 
                               "Delay":
                               "Undefined";
     

             const pgResponse = {
                transactionStatus: paymentStatus,
                transactionRespMsg: pgPaymentMsg,
              };
    
              orderController.updateOrder(orderId,pgResponse).then(function(data){
                  if(data!=null){
                    return res.status(200).send({code:200, message: "Success", data: data});
                  }
                  else{
                    console.log("Order update response is null");
                    return res.status(400).send({code:400, message: "Payment Failed", data: null});
                  }
              });
    
}


exports.pendingPayment= async(req,res)=>{
    var orderId = req.body.orderId;
    var readTimeout = 80000;
    
    var paymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(orderId);
    var paymentStatusDetail = paymentStatusDetailBuilder.setReadTimeout(readTimeout).build();
     Paytm.Payment.getPaymentStatus(paymentStatusDetail).then(function (response) {
        if (response instanceof Paytm.SDKResponse) {
           
            var respBody=response.getJsonResponse();
    
            var json=JSON.parse(respBody);


            var pgPaymentStatus=json["body"]["resultInfo"]["resultStatus"];
            var pgPaymentMsg=json["body"]["resultInfo"]["resultMsg"];


            var paymentStatus= (pgPaymentStatus="TXN_SUCCESS")? 
                               "Completed": 
                               (pgPaymentStatus="TXN_FAILED")? 
                               "Failed":
                               (pgPaymentStatus="PENDING")? 
                               "Delay":
                               "Undefined";
     

                               const pgResponse = {
                                transactionStatus: paymentStatus,
                                transactionRespMsg: pgPaymentMsg,
                              };
                    
                              orderController.updateOrder(orderId,pgResponse).then(function(data){
                                  if(data!=null){
                                    return res.status(200).send({code:200, message: "Success", data: data});
                                  }
                                  else{
                                    return res.status(400).send({code:400, message: "Payment Failed", data: null});
                                  }
                              });

        }
        else{
            var respBody=response.getResponseObject();
            console.log(respBody);
            return res.status(400).send({code:400, message: "No data", data: null});
        }
    });
    
}