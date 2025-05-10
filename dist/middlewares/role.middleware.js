"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (roles) => {
    return (req, res, next) => {
        const user = req.user; // assuming you've added the user in auth middleware
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ error: "Access denied" });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
