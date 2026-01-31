import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, rememberMe) => {
	const tokenExpiration = rememberMe ? "7d" : "1d";

	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: tokenExpiration,
	});

	res.cookie("token", token, {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // Matching 7d vs 1d
	});

	return token;
};
