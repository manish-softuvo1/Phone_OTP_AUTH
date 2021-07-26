module.exports = (req, res, next) => {
    let currentUser = req.locals.user;
    if(!currentUser){
        return next({
            status: 201,
            message: "You are not eligible to access"
        })
    }
    if(currentUser === 'admin'){
        return next();
    }
    return next({
        status: 401,
        message: "Not able to access"
    })
}