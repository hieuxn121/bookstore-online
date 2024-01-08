const authProvider = {
  isAuthenticated: false,
  signin: (callback) => {
    authProvider.isAuthenticated = true
    callback()
  },
  signout: (callback) => {
    authProvider.isAuthenticated = false
    callback()
  }
}

export { authProvider }
