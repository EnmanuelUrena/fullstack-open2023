import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons"

export const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

export const createPerson = (data) => {
  return axios.post(baseUrl, data).then(response => response.data)
}

export const deletePerson = (id) => {
  axios.delete(`${baseUrl}/${id}`)
}

export const updatePerson = (id, data) => {
  return axios.put(`${baseUrl}/${id}`, data).then(response => response.data)
}
