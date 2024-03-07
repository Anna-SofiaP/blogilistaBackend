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
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}