export function notFoundMiddleware(req, res) {
    //there is no need for next bcz it will directly return response
    //catch all route - if any route doesn't exists it will catch it

    res.status(404).json({
        success: false,
        message: "Path Not Found"
    });
}