function notFound(req, res, next) {
  res.status(404).json({ message: "Route not found" });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Please check your input and try again." });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: "An account with this email already exists." });
  }

  const status = err.status || 500;
  const message =
    status === 500
      ? "Something went wrong. Please try again."
      : err.message || "Request failed";

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
