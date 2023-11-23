import { useState } from 'react'
import BlogForm from './BlogForm'
import Togglable from './Toggable'

const Blogs = ({
  blogs,
  handleNewBlog,
  blogFormRef,
  handleLikes,
  handleRemove,
  user,
}) => (
  <div>
    <Togglable buttonLabel={'create new blog'} ref={blogFormRef}>
      <BlogForm handleNewBlog={handleNewBlog} />
    </Togglable>
    <p></p>
    {blogs.map((blog) => (
      <Blog
        key={blog.id}
        blog={blog}
        handleLikes={handleLikes}
        handleRemove={handleRemove}
        user={user}
      />
    ))}
  </div>
)

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
    <div style={blogStyle}>
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
          {blog.user?.username === user.username && (
            <div>
              <button onClick={() => handleRemove(blog)}>remove</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Blogs
