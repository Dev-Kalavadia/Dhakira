module.exports = {
  apps : [{
   name: "shipping",
   script: "./start.js",
   env: {
      NODE_ENV: "prod",
      PORT:8888,
   }
  }]
}
