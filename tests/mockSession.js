const mockSession = (user) => {
    return (req, res, next) => {
        req.user = user;
        req.isAuthenticated = () => true;
        next();
    };
};

module.exports = mockSession;