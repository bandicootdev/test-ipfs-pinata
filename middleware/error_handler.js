module.exports = (error, req, res, next) => {
    if (res.headersSent) {
        next(error);
    }
    return res.status(500).json({
        ok: false,
        error: error.message
    });
}