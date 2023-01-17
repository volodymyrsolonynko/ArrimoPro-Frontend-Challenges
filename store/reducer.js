import { combineReducers } from 'redux'
import { hashById } from '../components/calendar/utils'

export default combineReducers({
  weekendsVisible,
  eventsById
})

function weekendsVisible(weekendsVisible = true, action) {
  switch (action.type) {

    case 'TOGGLE_WEEKENDS':
      return !weekendsVisible

    default:
      return weekendsVisible
  }
}

function eventsById(eventsById = {}, action) {
  switch (action.type) {

    case 'RECEIVE_EVENTS':
      return hashById(action.plainEventObjects)

    case 'CREATE_EVENT':
    case 'UPDATE_EVENT':
      window.localStorage.setItem('eventList', JSON.stringify({
        ...eventsById,
        [action.plainEventObject.id]: action.plainEventObject
      }));
      return {
        ...eventsById,
        [action.plainEventObject.id]: action.plainEventObject
      }

    case 'DELETE_EVENT':
      eventsById = { ...eventsById } // copy
      delete eventsById[action.eventId]
      window.localStorage.setItem('eventList', JSON.stringify({
        ...eventsById
      }));
      return eventsById

    default:
      return eventsById
  }
}