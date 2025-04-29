const blogsRouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const getToken = (request) => {
    // Get value of the authorization header from request body
    const auth = request.get('authorization')
    if (auth && auth.startsWith('Bearer ')) {
        // return only the token
        return auth.replace('Bearer ', '')
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, id: 1 })
    logger.info('All blogs: ', blogs)
    response.json(blogs)
})
  

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    try {
        // Decode the token that was sent with the request
        const decodedToken = jwt.verify(getToken(request), process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'invalid token' })
        }
    }
    catch(error) {
        next(error)
    }
    

    const user = await User.findById(decodedToken.id)
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
    logger.info('Adding new post... ', blog)

    const result = await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    logger.info('New post added! ', result)
    response.status(201).json(result)
})


blogsRouter.delete('/:id', async (request, response, next) => {
    const noteToDelete = request.params.id
    logger.info('Deleting a post with id: ', noteToDelete)

    try {
        const result = await Blog.findByIdAndDelete(noteToDelete)
        logger.info('Post deleted! ', result)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter