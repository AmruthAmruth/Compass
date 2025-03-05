

export const isUserAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).redirect('/login');
    }
    next();
};