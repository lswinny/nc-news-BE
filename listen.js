const app = require("./middlewear/app")
const { PORT = 9090 } = process.env

app.listen(PORT, () => console.log("Server is listening on port ${PORT}..."));