const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
//sdkjf

loginRouter.post('/', async (request, response) => {
    logger.info("Now we're in the backend")
    const { username, password } = request.body
    const user = await User.findOne({username})
    logger.info("User who wants to log in: " + user)

    const correctPassword = user === null
        ? false
        : await bcryptjs.compare(password, user.passwordHash)
    
    logger.info("The password was correct: " + correctPassword)

    if (!(user && correctPassword)) {
        logger.error("There was no user or password was not correct!")
        return response.status(401).json({error: 'invalid username or password'})
    }

    const userInfo = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userInfo, process.env.SECRET)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter