const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let initValue = 0
    const sum = blogs.reduce((acc, curr) => acc + curr, initValue)
}
  
module.exports = {
    dummy,
    totalLikes,
}