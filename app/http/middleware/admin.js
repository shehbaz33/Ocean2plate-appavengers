function isAdmin(req, res, next) {
    console.log(req.user)
    if (req.isAuthenticated() && (req.user.role != 'customer')) {
        return next();
    }
    return res.redirect('/')
}

module.exports = isAdmin