const getServerHealthCheck = (req, res) => {
  res.status(200).send("Welcome!");
};

module.exports = { getServerHealthCheck };
