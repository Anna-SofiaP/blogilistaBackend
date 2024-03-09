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

test('identifier for a blog should be id and not _id', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body    //.map(item => item.id)
    //assert.strictEqual(response.body.length, initialBlogList.length)
    assert(blogs.every(blog => 'id' in blog && typeof blog.id === 'string' && !('_id' in blog)))
})

test('a blog can be added', async () =>{
    const newBlog = {
        title: 'Lovely Live',
        author: 'Adam Adams',
        url: 'www.adamslovelylife.com',
        likes: 52
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogs = response.body.map(item => item.content)
    
    assert.strictEqual(response.body.length, initialBlogList.length + 1)
    
    assert(blogs.includes('Lovely Live'))
})

after(async () => {
  await mongoose.connection.close()
})