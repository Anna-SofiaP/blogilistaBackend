const config = require('./utils/config')
//require('dotenv').config()
const express = require('express')
const app = express()
//const cors = require('cors')
const blogsRouter = require('./controllers/blogsroutes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
})

//app.use(cors())
app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)
app.use(middleware.errorHandler)

module.exports = app
