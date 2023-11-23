import { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import LoginInfo from './components/LoginInfo'
import Notification from './components/Notification'
import loginService from './services/login'

import './App.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    async function fetchData() {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  async function handleLogout() {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  async function handleLogin(newObject) {
    try {
      const newUser = await loginService.login(newObject)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(newUser))
      blogService.setToken(newUser.token)
      setUser(newUser)
    } catch (error) {
      console.error(error)
      if (error.name === 'AxiosError') {
        error.response.status === 401
          ? setErrorMessage('user or password invalid')
          : setErrorMessage(error.message)
      } else {
        setErrorMessage(error.response.data.error)
      }
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  async function handleNewBlog(newObject) {
    try {
      const blog = await blogService.create(newObject)
      const blogWithUser = {
        ...blog,
        user: {
          id: blog.user,
          name: user.name,
        },
      }
      setBlogs(blogs.concat(blogWithUser))
      setSuccessMessage(
        `a new blog ${newObject.title} by ${newObject.author} added`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      console.error(error)
      if (error.name === 'AxiosError') {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(error.response.data.error)
      }
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  async function handleLikes(blogToUpdate) {
    try {
      blogToUpdate.likes++
      blogToUpdate.user = blogToUpdate.user?.id
      const blogWithUser = {
        ...blogToUpdate,
        user: {
          id: blogToUpdate.user,
          name: user.name,
        },
      }
      await blogService.update(blogToUpdate.id, blogToUpdate)
      setBlogs(
        blogs.map((blog) => (blog.id !== blogToUpdate.id ? blog : blogWithUser))
      )
    } catch (error) {
      console.error(error)
      if (error.name === 'AxiosError') {
        setErrorMessage(error.message)
      } else {
        setErrorMessage(error.response.data.error)
      }
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  async function handleRemove(blogToDelete) {
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      )
    ) {
      try {
        await blogService.remove(blogToDelete.id)
        setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id)) //TODO
      } catch (error) {
        console.error(error)
        if (error.name === 'AxiosError') {
          setErrorMessage(error.message)
        } else {
          setErrorMessage(error.response.data.error)
        }
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  return (
    <div>
      {user === null ? (
        <>
          <h2>Log in to application</h2>
          <Notification message={errorMessage} className={'error'} />
          <LoginForm handleLogin={handleLogin} />
        </>
      ) : (
        <>
          <h2>blogs</h2>
          <Notification message={successMessage} className={'success'} />
          <LoginInfo user={user} handleLogout={handleLogout} />
          <p></p>
          <Blogs
            blogs={blogs}
            handleNewBlog={handleNewBlog}
            blogFormRef={blogFormRef}
            handleLikes={handleLikes}
            handleRemove={handleRemove}
            user={user}
          />
        </>
      )}
    </div>
  )
}

export default App
