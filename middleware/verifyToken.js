export async function verifyToken(req,res,next){
    // console.log(req.token)
    next(new Error("access unauthorized"))
}
// NOT used till now anywhere   