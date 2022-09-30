const path = require("path")

export default {
  resolve: {
    alias: {
      "@marcoroth/local-time": path.resolve(__dirname, "../app/assets/javascripts/local-time.js")
    }
  }
}
