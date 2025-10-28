const getServerHealthCheck = (req, res) => {
  res.status(200).send("Healthy Server!");
};

module.exports = { getServerHealthCheck };
