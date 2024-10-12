exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'You must be logged in to access this resource' });
};

exports.isAuthorized = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (roles.includes(req.user.role)) {
            return next();
        }
        res.status(403).json({ message: 'You do not have permission to perform this action' });
    };
};