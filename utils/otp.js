const fast2sms = require('fast-two-sms');
const{ FAST2SMS } = require('../config/config');
const{ TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = require('../config/config');

exports.generateOTP = (otp_length) => {
    var digits = "0123456789";
    let OTP = "";
    for(let i=0; i<otp_length; i++){
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;

};

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


// exports.fast2sms = async({ message, contactNumber }, next) => {

//     try {
//         const res = await fast2sms.sendMessage({
//             authorization: FAST2SMS,
//             message,
//             numbers: [contactNumber],
//         });
//     } catch (error) {
//         next (error)
//     }
// }

// await client.messages
// .create({
//     body: 'Admin has reset your password . Please use this password to login Clikiko. Your current password is  ' + password,
//     from: twilio.TWILIO_PHONE_NUMBER,
//     to: "+91" + phone
// })
// .then(message => console.log(message.sid));


exports.fast2sms = async({message, contactNumber}, next) => {
    try {
        const res = await client.messages.create({
            body: message,
            from: '+14439633721',
            to: [contactNumber]
        })
        .then(message => console.log("message.sid=================>>>>>>",message.sid));
        console.log("res----------", res)
    }
    catch (error) {
        next(error)
    }
}