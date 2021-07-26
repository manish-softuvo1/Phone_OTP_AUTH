const User = require('../models/user');
const { checkPassword, hashPassword } = require('../utils/password');
const { createJwtToken } = require('../utils/token');

const { generateOTP, fast2sms } = require('../utils/otp');



exports.createNewUser = async(req, res, next) => {
    try {
        const { phone, name } = req.body;

        const phoneExist = await User.findOne({ phone });
        console.log("phoneExist", phoneExist)

        if(phoneExist){
            next({
                status: 400,
                message: "Phone already exist"
            });
            return;
        }

        const createUser = new User({
            phone,
            name,
            role: phone === process.env.ADMIN_PHONE ? "ADMIN" : "USER"
        });

        const user = await createUser.save();
        console.log("user======", user)
        
        res.status(200).json({
            type: 'success',
            message: 'OTP send to your mobile',
            data: {
                userId: user._id
            }
        });

        const otp = generateOTP(6);
        user.phoneOtp = otp;
        await user.save();

        await fast2sms({
            message: `Your OTP is ${otp}`,
            contactNumber : user.phone
        },
        next
        );
    } catch(error){
        next(error).json({
            message: "error while creating user"
        })
    }
}


exports.loginWithPhoneOtp = async (req, res, next) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phone });

        if(!user){
            next({
                status: 400,
                message: "Phone not found"
            });
            return;
        }

        res.status(201).json({
            type: "success",
            message: "OTP send to your number",
            data: {
                userId: user._id
            }
        });
        const otp = generateOTP(6);
        user.phoneOtp = otp;
        user.isAccountVerified = true;

        await user.save();

        await fast2sms({
            message: `Your OTP is ${otp}`,
            contactNumber: `+91${user.phone}`,
        },
        next
        );
    } catch (error) {
        next(error)
    }
};

exports.verifyPhoneOtp = async(req, res, next) => {
    try {
        const { otp, userId } = req.body;
        const user = await User.findById(userId);
        if(!user){
            next({
                status: 400,
                message: "User not found error"
            });
            return;
        } 
        if(user.phoneOtp !== otp){
            next({
                status: 400,
                message: "Incorrect Otp error"
            });
            return;
        } 
        const token = createJwtToken({
            userId: user._id
        });

        user.phoneOtp = "";
        await user.save();

        res.status(201).json({
            type: "success",
            message: "Otp verified successfully",
            data: {
                token, 
                userId: user._id
            }
        });

    } catch(error){
        next(error);
    }
};

exports.fetchCurrentUser = async(req, res, next) => {
    try {
        const currentUser = res.locals.user;
        return res.status(200).json({
            type: "success",
            message : "fetch current User",
            data: {
                user: currentUser,
            }    
        });
    } catch (error) {
        next(error)
    }
}

exports.handleAdmin = async(req, res, next) => {
    try {
        const currentUser = res.locals.user;

        return res.status(200).json({
            type: "success",
            message: "You are admin",
            data: {
                user: currentUser,
            }
        })
    } catch (error){
        next(error)
    }
}

