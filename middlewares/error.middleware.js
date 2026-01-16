const BaseError = require("../errors/base.error");

module.exports = function (err, req, res, next) {
  const rawLocale = req.headers["accept-language"] || "uz";
  const userLocale = rawLocale.split("-")[0];

  // If error is already an instance of BaseError, return it directly
  if (err instanceof BaseError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      locale: userLocale,
    });
  }

  // Validation errors (Mongoose ValidationError or custom errors object)
  if (err.name === "ValidationError" || err.errors) {
    const validationError = BaseError.ValidationError(
      err.errors || [],
      userLocale
    );
    return res.status(validationError.status).json({
      success: false,
      message: validationError.message,
      errors: validationError.errors,
      locale: userLocale,
    });
  }
  console.log(err);

  // MongoDB duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    const conflictError = BaseError.Conflict(
      `${field} allaqachon mavjud`,
      userLocale
    );
    return res.status(conflictError.status).json({
      success: false,
      message: conflictError.message,
      errors: [],
      locale: userLocale,
    });
  }

  if (err.name === "CastError") {
    const notFoundError = BaseError.NotFound("Ma'lumot", userLocale);
    return res.status(notFoundError.status).json({
      success: false,
      message: notFoundError.message,
      errors: [],
      locale: userLocale,
    });
  }

  const serverError = BaseError.InternalServerError(userLocale);
  return res.status(serverError.status).json({
    success: false,
    message: serverError.message,
    errors: [],
    locale: userLocale,
  });
};
