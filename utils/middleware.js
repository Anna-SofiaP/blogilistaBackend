const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(400).json({ error: 'invalid or missing token' })
    }
  
    next(error)
}

const tokenExtractor = (request, response, next) => {
    // Get value of the authorization header from request body
    logger.info("Token extraction")
    const auth = request.get('authorization')
    if (auth && auth.startsWith('Bearer ')) {
        request.token = auth.replace('Bearer ', '')
        logger.info("Token was extracted: " + request.token)
    } else {
        request.token = null
    }

    next()
}

const userExtractor = async (request, response, next) => {
  try {
    // Decode the token that was sent with the request
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    //logger.info("token: " + decodedToken)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }
    logger.info("Id of the user: " + decodedToken.id)
    const user = await User.findById(decodedToken.id)
    request.user = user
    logger.info("request.user: " + request.user)

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { errorHandler, tokenExtractor, userExtractor }