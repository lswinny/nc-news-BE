function handlePsqlErrors(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request: Please check the format of your input" });
  } else if (err.code === "23502"){
    res.status(400).send({msg: "Bad request: Missing required fields"})
  } else {
    next(err);
  }
}

function handleCustomErrors(err, req, res, next) {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

function handleServerErrors(err, req, res, next) {
  console.error("Hello from Error Handling Middleware 500", err);
  res.status(500).send({ msg: "Internal Server Error" });
}

module.exports = {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
};
