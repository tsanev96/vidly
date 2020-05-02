module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            console.log('FAILED!!!')
            next(ex);
        }
    }
}