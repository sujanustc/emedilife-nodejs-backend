module.exports = middlewareRoot = (req, res, next) => {
    console.log("Method -> ", req.method, " => ","https://"+req.headers.host + req.url);
    //   console.log("host",req.headers.host);
    console.log("body -> ", req.body);
    console.log("query -> ", req.query);
    console.log("params -> ", req.params);
    next();
};