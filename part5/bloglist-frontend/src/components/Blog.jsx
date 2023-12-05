import { useState } from 'react'

const Blog = ({ blog, handleLikes, handleRemove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const [view, setView] = useState(false)
  function toggleView() {
    setView(!view)
  }
  return (
    <div style={blogStyle} className="blog-container">
      {!view ? (
        <>
          {blog.title} {blog.author} <button onClick={toggleView}>view</button>
        </>
      ) : (
        <>
          {blog.title} {blog.author}
          <button onClick={toggleView}>hide</button>
          <div>
            <a href={'/'}>{blog.url}</a>
          </div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => handleLikes(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {blog.user?.username === user?.username && (
            <div>
              <button onClick={() => handleRemove(blog)}>remove</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Blog