const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let initValue = 0
    const sum = blogs.reduce((acc, currentVal) => acc + currentVal.likes, initValue)
    return sum
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return 0
    let favorite = blogs[0]
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > favorite.likes) {
            favorite = blogs[i]
        }
    }
    const newFavorite = {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
    return newFavorite
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return 0
    
    let authors = [blogs[0].author]
    let blogAmount = [1]

    for (let i = 1; i < blogs.length; i++) {
        let current = blogs[i].author
        if (authors.includes(current)) {
            let index = authors.indexOf(current)
            blogAmount[index]++
        } else {
            authors.concat(current)
            blogAmount.concat(1)
        }
    }

    let greatest = blogAmount[0]
    let indexOfGreatest = 0

    for (let i = 1; i < blogAmount.length; i++) {
        if (blogAmount[i] > greatest) {
            greatest = blogAmount[i]
            indexOfGreatest = i
        }
    }

    const mostBlogs = {
        author: authors[indexOfGreatest],
        blogs: greatest
    }

    return mostBlogs
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
}