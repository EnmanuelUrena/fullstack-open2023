import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers:{
    addNotification(state, action){
      return action.payload
    },
    clearNotification(state, action){
      return action.payload = ''
    }
  }
})

export const {addNotification, clearNotification} = notificationSlice.actions

export const setNotification = (content, timeout) => {
  return async dispatch => {
    dispatch(addNotification(content))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }

}
export default notificationSlice.reducer