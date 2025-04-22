const { test, after, beforeEach, describe } = require('node:test')
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

// Tehtävä 4.8
test('testing the get-method', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, initialBlogList.length)
})

// Tehtävä 4.9
test('identifier for a blog should be id and not _id', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body    //.map(item => item.id)
    //assert.strictEqual(response.body.length, initialBlogList.length)
    assert(blogs.every(blog => 'id' in blog && typeof blog.id === 'string' && !('_id' in blog)))
})

// Tehtävä 4.10
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
    const blogs = response.body.map(item => item.title)
    
    assert.strictEqual(response.body.length, initialBlogList.length + 1)
    
    assert(blogs.includes('Lovely Live'))
})

// Tehtävä 4.13
describe('deleting a post', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        let blogObject = new Blog(initialBlogList[0])
        await blogObject.save()
        blogObject = new Blog(initialBlogList[1])
        await blogObject.save()
    })

    test('is done correctly', async () => {
        const response = await api.get('/api/blogs')
        blogToBeDeleted = response.body[0].id

        await api
            .del('/api/blogs/' + blogToBeDeleted)
            .expect(204)
        
        const newResponse = await api.get('/api/blogs')
        const blogs = newResponse.body.map(item => item.title)

        assert.strictEqual(blogs.includes('My Awesome Blog'), false)
    })

    test('decreases the number of posts by one', async () => {
        const response = await api.get('/api/blogs')
        blogToBeDeleted = response.body[0].id

        await api
            .del('/api/blogs/' + blogToBeDeleted)
            .expect(204)
        
        const newResponse = await api.get('/api/blogs')

        assert.strictEqual(newResponse.body.length, initialBlogList.length - 1)
    })

    test('fails for a nonexistent blog with status code 400', async () => {
        const nonexistentBlog = "0101"

        await api
            .del('/api/blogs/' + nonexistentBlog)
            .expect(400)

        const response = await api.get('/api/blogs')
        
        assert.strictEqual(response.body.length, initialBlogList.length)
    })
})

after(async () => {
  await mongoose.connection.close()
})