import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export const generateToken = (payload) => {
    return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
};
