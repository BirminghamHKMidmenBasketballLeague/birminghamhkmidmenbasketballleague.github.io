import { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core'
import { Modal } from '../components/ui/modal'
import { useModal } from '../hooks/useModal'
import PageMeta from '../components/common/PageMeta'
import { calendarsEvents } from '../data/CalendarEvents'
import { dateFormat } from '../data/DateFormat'

export interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string
    description?: string
    location?: string
  }
}

const Calendar: React.FC = () => {
  // const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [eventTitle, setEventTitle] = useState('')
  const [eventStartDate, setEventStartDate] = useState('')
  const [eventEndDate, setEventEndDate] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  // const [eventLevel, setEventLevel] = useState('')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const calendarRef = useRef<FullCalendar>(null)
  const { isOpen, openModal, closeModal } = useModal()

  // const eventsLevel = {
  //   Danger: 'danger',
  //   Success: 'success',
  //   Primary: 'primary',
  //   Warning: 'warning',
  // }

  useEffect(() => {
    // Initialize with some events
    setEvents(calendarsEvents)
  }, [])

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields()
    setEventStartDate(selectInfo.startStr)
    setEventEndDate(selectInfo.endStr || selectInfo.startStr)
    openModal()
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event
    // setSelectedEvent(event as unknown as CalendarEvent)
    setEventTitle(event.title)
    setEventStartDate(event.start?.toLocaleString('en-US', dateFormat) || '')
    setEventEndDate(event.end?.toLocaleString('en-US', dateFormat) || '')
    setEventLocation(event.extendedProps.location || '')
    setEventDescription(event.extendedProps.description || '')
    // setEventLevel(event.extendedProps.calendar)
    openModal()
  }

  // const handleAddOrUpdateEvent = () => {
  //   if (selectedEvent) {
  //     // Update existing event
  //     setEvents((prevEvents) =>
  //       prevEvents.map((event) =>
  //         event.id === selectedEvent.id
  //           ? {
  //               ...event,
  //               title: eventTitle,
  //               start: eventStartDate,
  //               end: eventEndDate,
  //               extendedProps: { calendar: eventLevel },
  //             }
  //           : event
  //       )
  //     )
  //   } else {
  //     // Add new event
  //     const newEvent: CalendarEvent = {
  //       id: Date.now().toString(),
  //       title: eventTitle,
  //       start: eventStartDate,
  //       end: eventEndDate,
  //       allDay: true,
  //       extendedProps: { calendar: eventLevel },
  //     }
  //     setEvents((prevEvents) => [...prevEvents, newEvent])
  //   }
  //   closeModal()
  //   resetModalFields()
  // }

  const resetModalFields = () => {
    setEventTitle('')
    setEventStartDate('')
    setEventEndDate('')
    // setEventLevel('')
    // setSelectedEvent(null)
  }

  return (
    <>
      <PageMeta
        title="BHK League"
        description="Birmingham HK Midmen Basketball League"
      />
      <div className="rounded-2xl border  border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            selectable={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            timeZone="UTC"
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short',
              hour12: false,
            }}
          />
        </div>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[700px] p-6 lg:p-10"
        >
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div>
              <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
                {eventTitle}
              </h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Here's the details of the event.
              </p>
            </div>
            <div className="mt-8">
              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Start
                </label>
                <div className="relative">
                  <p
                    id="event-start-date"
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  >
                    {eventStartDate}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  End
                </label>
                <div className="relative">
                  <p
                    id="event-end-date"
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  >
                    {eventEndDate}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Location
                </label>
                <div className="relative">
                  <p
                    id="event-end-date"
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  >
                    {eventLocation}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Description
                </label>
                <div className="relative">
                  <p
                    id="event-end-date"
                    className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  >
                    {eventDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  )
}

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  )
}

export default Calendar
