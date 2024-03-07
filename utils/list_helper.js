const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let initValue = 0
    const sum = blogs.reduce((acc, currentVal) => acc + currentVal.likes, initValue)
    return sum
}
  
module.exports = {
    dummy,
    totalLikes,
}