const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogList = [
    {
        title: 'My Awesome Blog',
        author: 'John Smith',
        url: 'www.myawesomeblog.com',
        likes: 17
    },
    {
        title: 'Best Blog Ever',
        author: 'Margo Madison',
        url: 'www.bestblogever.com',
        likes: 26
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogList[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogList[1])
    await blogObject.save()
})

test('testing the get-method', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, initialBlogList.length)
})

after(async () => {
  await mongoose.connection.close()
})