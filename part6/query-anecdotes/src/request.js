import axios from "axios";

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => axios.get(baseUrl).then(res => res.data)

export const createAnecdotes = (newAnecdote) => axios.post(baseUrl, newAnecdote).then(res => res.data)

export const updateAnecdotes = (anecdoteToUpdate) => axios.put(`${baseUrl}/${anecdoteToUpdate.id}`, anecdoteToUpdate).then(res => res.data)