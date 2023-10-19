const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs[0].likes
}

const favoriteBlog = (blogs) => {
  let favorite = blogs[0]
  blogs.forEach(blog => {
    if(favorite.likes < blog.likes)
    {
      favorite = blog
    }
  })

  const {title, author, likes} = favorite

  return {title, author, likes}
}

const mostBlogs = (blogs) => {
  const authorBlogCount = {}

  blogs.forEach(blog => {
    if (authorBlogCount[blog.author]) {
      authorBlogCount[blog.author]++
    } else {
      authorBlogCount[blog.author] = 1
    }
  })

  let topAuthor = '';
  let maxBlogs = 0

  for (const author in authorBlogCount) {
    if (authorBlogCount[author] > maxBlogs) {
      topAuthor = author;
      maxBlogs = authorBlogCount[author];
    }
  }

  return {author : topAuthor, blogs : maxBlogs}
}

const mostLikes = (blogs) => {

  const authorLikesCount = {}

  blogs.forEach(blog => {
    if(authorLikesCount[blog.author]){
      authorLikesCount[blog.author] = authorLikesCount[blog.author] + blog.likes
    } else {
      authorLikesCount[blog.author] = blog.likes
    }
  });

  let topAuthor = '';
  let maxLikes = 0

  for (const author in authorLikesCount) {
    if (authorLikesCount[author] > maxLikes) {
      topAuthor = author;
      maxLikes = authorLikesCount[author];
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostLikes, mostBlogs
}