
export function errorhandler(err,req,res,next){
    res.status(404).json({
        message:"error handler starts handling error",
        Error:err.message
    })
} 