import { useState } from 'react'
import BlogForm from './BlogForm'
import Togglable from './Toggable'

import Blog from './Blog'

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
    {blogs.sort((a,b) => b.likes - a.likes).map((blog) => (
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

export default Blogs

