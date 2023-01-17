import FullCustomCalendar from '../components/calendar/fullcalendar'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import rootReducer from '../store/reducer'

let store = createStore(rootReducer, applyMiddleware(thunk))

const Calendar = () => {
  return (
    <Provider store={store}>
      < FullCustomCalendar />
    </Provider>
  )
};

export default Calendar;