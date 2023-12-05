import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

import Blog from './Blog'


describe ('blog info renders', () => {
  let container
  let blog

  beforeEach(() => {
    blog = {
      title: 'Un mes en DIAPE',
      author: 'Enmanuel Urena',
      url: 'N/A',
      likes: 0,
      user: '6538022b04e4fd142410a750',
      id: '653980c12ed42a2866a9c52c'
    }
    container = render(<Blog blog={blog} />).container
  })

  test('blog title and author renders', () => {
    const div = container.querySelector('.blog-container')
    expect(div).toHaveTextContent(`${blog.title} ${blog.author}`)
    expect(div).not.toHaveTextContent(`${blog.url} ${blog.likes}`)
  })

  test('likes and url renders when click the button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const div = container.querySelector('.blog-container')
    expect(div).toHaveTextContent(`${blog.title} ${blog.author}hide${blog.url}likes ${blog.likes} likeremove`)
  })
})

describe('blog buttons renders', () => {
  let container
  let blog
  let mockHandler

  beforeEach(() => {
    blog = {
      title: 'Un mes en DIAPE',
      author: 'Enmanuel Urena',
      url: 'N/A',
      likes: 0,
      user: '6538022b04e4fd142410a750',
      id: '653980c12ed42a2866a9c52c'
    }
    mockHandler = jest.fn()
    container = render(<Blog blog={blog} handleLikes={mockHandler}/>).container
  })
  test('like button click twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
