const proxy = require("http-proxy-middleware")

module.exports = app => {
  app.use(proxy("/comm", {target: "http://localhost:8080", ws: true}))
}