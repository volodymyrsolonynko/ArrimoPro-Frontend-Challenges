import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import FullCalendar from '@rmcooper/next-fullcalendar'
import { formatDate } from '@rmcooper/next-fullcalendar/common'
import dayGridPlugin from '@rmcooper/next-fullcalendar/daygrid'
import timeGridPlugin from '@rmcooper/next-fullcalendar/timegrid'
import interactionPlugin from '@rmcooper/next-fullcalendar/interaction'
import classnames from "classnames";
import actionCreators from './actions'
import { getHashValues } from './utils'
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Modal,
  Row,
  Col
} from "reactstrap";
import { useState } from 'react';

const FullCustomCalendar = (props) => {

  const renderSidebar = () => {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop, and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div>
        <div className='demo-app-sidebar-section'>
          <label>
            <input
              type='checkbox'
              checked={props.weekendsVisible}
              onChange={props.toggleWeekends}
            ></input>
            toggle weekends
          </label>
        </div>
        <div className='demo-app-sidebar-section'>
          <h2>All Events ({props.events.length})</h2>
          <ul>
            {props.events.map(renderSidebarEvent)}
          </ul>
        </div>
      </div>
    )
  }

  // handlers for user actions
  // ------------------------------------------------------------------------------------------

  const handleDateSelect = (selectInfo) => {
    let calendarApi = selectInfo.view.calendar
    let title = prompt('Please enter a new title for your event')

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({ // will render immediately. will call handleEventAdd
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      }, true) // temporary=true, will get overwritten when reducer gives new events
    }
  }

  const handleEventClick = (clickInfo) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove() // will render immediately. will call handleEventRemove
    }
  }

  // handlers that initiate reads/writes via the 'action' props
  // ------------------------------------------------------------------------------------------

  const handleDates = (rangeInfo) => {
    props.requestEvents(rangeInfo.startStr, rangeInfo.endStr)
      .catch(reportNetworkError)
  }

  const handleEventAdd = (addInfo) => {
    props.createEvent(addInfo.event.toPlainObject())
      .catch(() => {
        reportNetworkError()
        addInfo.revert()
      })
  }

  const handleEventChange = (changeInfo) => {
    props.updateEvent(changeInfo.event.toPlainObject())
      .catch(() => {
        reportNetworkError()
        changeInfo.revert()
      })
  }

  const handleEventRemove = (removeInfo) => {
    props.deleteEvent(removeInfo.event.id)
      .catch(() => {
        reportNetworkError()
        removeInfo.revert()
      })
  }

  const renderEventContent = (eventInfo) => {
    return (
      <div className='event-style'>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
        <span className='event-edit' onClick={() => handleEventContentChange(eventInfo)}>Edit</span>
        <span className='event-delete' onClick={() => handleEventClick(eventInfo)}>Delete</span>
      </div>
    )
  }

  const handleEventContentChange = (changeInfo) => {
    let title = prompt('Please enter a new title for your event');
    changeInfo.event.setProp('title', title);
  }

  function renderSidebarEvent(plainEventObject) {
    return (
      <li key={plainEventObject.id}>
        <b>{formatDate(plainEventObject.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
        <i>{plainEventObject.title}</i>
      </li>
    )
  }

  const reportNetworkError = () => {
    alert('This action could not be completed')
  }

  return (
    <div className='demo-app'>
      {/* {renderSidebar()} */}
      <div className='demo-app-main'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={props.weekendsVisible}
          datesSet={handleDates}
          select={handleDateSelect}
          events={props.events}
          eventContent={renderEventContent} // custom render function
          // eventClick={handleEventClick}
          eventAdd={handleEventAdd}
          eventChange={handleEventChange} // called for drag-n-drop/resize
          eventRemove={handleEventRemove}
        />
      </div>
    </div>
  )
};

const mapStateToProps = () => {
  const getEventArray = createSelector(
    (state) => state.eventsById,
    getHashValues
  )

  return (state) => {
    return {
      events: getEventArray(state),
      weekendsVisible: state.weekendsVisible
    }
  }
}

export default connect(mapStateToProps, actionCreators)(FullCustomCalendar);