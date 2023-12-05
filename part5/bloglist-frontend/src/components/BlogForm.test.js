import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'

import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const newBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm handleNewBlog={newBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const sendButton = screen.getByText('create')
  await user.type(inputs[0], 'testing a title...')
  await user.type(inputs[1], 'testing a author...')
  await user.type(inputs[2], 'testing a url...')
  await user.click(sendButton)

  expect(newBlog.mock.calls).toHaveLength(1)
  expect(newBlog.mock.calls[0][0].title).toBe('testing a title...')
  expect(newBlog.mock.calls[0][0].author).toBe('testing a author...')
  expect(newBlog.mock.calls[0][0].url).toBe('testing a url...')
})

