import { CalenderIcon } from '../../icons'
import Badge from '../ui/badge/Badge'
import { calendarsEvents } from '../../data/CalendarEvents'
import { useModal } from '../../hooks/useModal'
import { Modal } from '../ui/modal'
import { dateFormat } from '../../data/DateFormat'

function getNextEvent(events: any[]) {
  const now = new Date()
  return events
    .map((e) => ({ ...e, date: new Date(e.start) }))
    .filter((e) => e.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0]
}

function getTimeLeft(eventDate: Date) {
  const now = new Date()
  const diffMs = eventDate.getTime() - now.getTime()
  if (diffMs <= 0) return 'Started'
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  if (hours > 0) return `${hours}h ${minutes}m left`
  return `${minutes}m left`
}

export default function NextEvent() {
  const nextEvent = getNextEvent(calendarsEvents)
  const { isOpen, openModal, closeModal } = useModal()

  if (!nextEvent) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Upcoming Event
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                No upcoming event
              </h4>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const timeLeft = getTimeLeft(nextEvent.date)
  const isSoon = nextEvent.date.getTime() - Date.now() < 24 * 60 * 60 * 1000

  return (
    <div className="gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div
        onClick={openModal}
        className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Upcoming
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {nextEvent.title}
            </h4>
          </div>
          <Badge color={isSoon ? 'error' : 'success'}>{timeLeft}</Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {nextEvent.title}
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
                  {new Date(nextEvent.start).toLocaleString(
                    'en-US',
                    dateFormat
                  )}
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
                  {new Date(nextEvent.end).toLocaleString('en-US', dateFormat)}
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
                  {nextEvent.extendedProps.location}
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
                  {nextEvent.extendedProps.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
