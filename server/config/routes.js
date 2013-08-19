/**
 * Routes
 */

 //

/**
 * Module dependencies
 */

var users     = require('../controllers/users')
  , resources = require('../controllers/resources')
  , types     = require('../controllers/types')
  , upload    = require('../controllers/upload')
  , sessions  = require('../controllers/sessions')
  , mongoose  = require('mongoose')
  , User      = mongoose.model('User')

/**
 * Expose routes
 */

module.exports = function(app) {

  app.get('/api/cookies', function(req, res, next) {
    // console.info(req.cookies.remember_token)
    res.send(req.cookies)
  })

  app.get('/api/types', types.index)

  app.get('/api/sessions/check', sessions.check)
  app.post('/api/sessions', sessions.create)

  app.post('/api/users', users.create)

  app.get('/api/resources', resources.index)
  app.post('/api/resources', isAuthenticated, resources.create)
  app.post('/api/resources/image', isAuthenticated, upload.uploadImage)

}

function isAuthenticated(req, res, next) {

  var remember_token = req.signedCookies['remember_token']

  if (remember_token) {
    User.findUserByRememberToken(remember_token, function(err, user) {

      if (err) { return next(err) }
      next()

    })
  }
  else {
    next(new Error(401))
  }

}
