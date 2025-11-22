// src/middleware/errorHandler.js

import ApiError from "../core/errors/ApiError.js";

const errorHandler = (err, req, res, next) => {
  const statusCode =
    err instanceof ApiError
      ? err.statusCode
      : res.statusCode !== 200
      ? res.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;