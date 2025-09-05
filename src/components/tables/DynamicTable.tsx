import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Badge from '../ui/badge/Badge'
import { Modal } from '../ui/modal'
import { useModal } from '../../hooks/useModal'

type DynamicTableProps<T extends Record<string, any>> = {
  tableData: T[]
  tableName: string
}

function getImageField(obj: Record<string, any>): string | undefined {
  // Heuristic: look for 'image', 'img', 'avatar', 'logo', 'picture' fields
  const imageKeys = ['image', 'img', 'avatar', 'logo', 'picture']
  for (const key of imageKeys) {
    if (
      typeof obj[key] === 'string' &&
      obj[key].match(/\.(jpg|jpeg|png|svg|webp|gif)$/i)
    ) {
      return obj[key]
    }
  }
  // fallback: first string field that looks like a path
  for (const key in obj) {
    if (
      typeof obj[key] === 'string' &&
      obj[key].match(/\.(jpg|jpeg|png|svg|webp|gif)$/i)
    ) {
      return obj[key]
    }
  }
  return undefined
}

function getNameField(obj: Record<string, any>): string | undefined {
  // Heuristic: look for 'name', 'title', 'username', 'product', 'fullName'
  const nameKeys = ['name', 'title', 'username', 'product', 'fullName']
  for (const key of nameKeys) {
    if (typeof obj[key] === 'string') {
      return obj[key]
    }
  }
  // fallback: first string field
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      return obj[key]
    }
  }
  return undefined
}

function getDescriptionField(obj: Record<string, any>): string | undefined {
  // Heuristic: look for 'description', 'desc', 'variants', 'subtitle', 'email', 'role'
  const descKeys = [
    'description',
    'desc',
    'variants',
    'subtitle',
    'email',
    'role',
    'position',
  ]
  for (const key of descKeys) {
    if (typeof obj[key] === 'string') {
      return obj[key]
    }
  }
  // fallback: second string field
  let count = 0
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      count++
      if (count === 2) return obj[key]
    }
  }
  return undefined
}

function getStatusField(
  obj: Record<string, any>
): { key: string; value: string } | undefined {
  // Heuristic: look for 'status', 'state', 'active', 'availability'
  const statusKeys = ['status', 'state', 'active', 'availability']
  for (const key of statusKeys) {
    if (typeof obj[key] === 'string') {
      return { key, value: obj[key] }
    }
  }
  return undefined
}

function getId(obj: Record<string, any>): string | number {
  // Try 'id', else first key
  if (obj.id !== undefined) return obj.id
  return Object.values(obj)[0]
}

function getTableHeaders<T extends Record<string, any>>(data: T[]): string[] {
  if (!data.length) return []
  const keys = Object.keys(data[0])
  // Move image/name/desc/status to preferred order, rest after
  const imageKey = getImageField(data[0])
    ? Object.keys(data[0]).find((k) => data[0][k] === getImageField(data[0]))
    : undefined
  const nameKey = getNameField(data[0])
    ? Object.keys(data[0]).find((k) => data[0][k] === getNameField(data[0]))
    : undefined
  const descKey = getDescriptionField(data[0])
    ? Object.keys(data[0]).find(
        (k) => data[0][k] === getDescriptionField(data[0])
      )
    : undefined
  const statusKey = getStatusField(data[0])?.key
  // Remove these from keys
  let rest = keys.filter(
    (k) => k !== imageKey && k !== nameKey && k !== descKey && k !== statusKey
  )
  // Compose header order: [main, ...rest, status]
  let headers: string[] = []
  headers.push('main')
  headers = headers.concat(rest)
  if (statusKey) headers.push(statusKey)
  return headers
}

function getBadgeColor(
  status: string
): 'success' | 'warning' | 'error' | 'info' {
  if (
    ['delivered', 'active', 'success', 'available'].includes(
      status.toLowerCase()
    )
  )
    return 'success'
  if (
    ['pending', 'waiting', 'in progress', 'processing'].includes(
      status.toLowerCase()
    )
  )
    return 'warning'
  if (
    [
      'canceled',
      'cancelled',
      'error',
      'inactive',
      'failed',
      'unavailable',
    ].includes(status.toLowerCase())
  )
    return 'error'
  return 'info'
}

// Helper for modal content
// removed unused renderModalContent

export default function DynamicTable<T extends Record<string, any>>({
  tableData,
  tableName,
}: DynamicTableProps<T>) {
  const headers = getTableHeaders(tableData)
  const firstRow = tableData[0] || {}
  const statusKey = getStatusField(firstRow)?.key
  const { isOpen, openModal, closeModal } = useModal()

  // Paging and search state
  const [search, setSearch] = React.useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState(() => 10)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pendingSearch, setPendingSearch] = React.useState('')
  const [pendingRows, setPendingRows] = React.useState(10)
  const [highlightedIds, setHighlightedIds] = React.useState<
    (string | number)[]
  >([])

  // Paging data (always show all rows, just highlight matches)
  const totalPages = Math.max(1, Math.ceil(tableData.length / rowsPerPage))
  const pagedData = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return tableData.slice(start, start + rowsPerPage)
  }, [tableData, currentPage, rowsPerPage])

  // Highlight rows matching search (do not filter out rows)
  React.useEffect(() => {
    if (!search) {
      setHighlightedIds([])
      return
    }
    const lower = search.toLowerCase()
    setHighlightedIds(
      tableData
        .filter((row) =>
          Object.values(row).some((val) =>
            String(val).toLowerCase().includes(lower)
          )
        )
        .map((row) => getId(row))
    )
  }, [search, tableData])

  // Modal actions
  const handleGo = () => {
    setSearch(pendingSearch)
    setRowsPerPage(Number(pendingRows))
    setCurrentPage(1)
    closeModal()
  }
  const handleCancel = () => {
    setPendingSearch(search)
    setPendingRows(rowsPerPage)
    closeModal()
  }
  // Open modal: sync pending fields
  const handleOpenModal = () => {
    setPendingSearch(search)
    setPendingRows(rowsPerPage)
    openModal()
  }
  // Reset filter
  const handleReset = () => {
    setSearch('')
    setPendingSearch('')
    setCurrentPage(1)
    setHighlightedIds([])
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {tableName}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <svg
              className="stroke-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 1V17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M1 9H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Reset
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {/* First column: main (image/name/desc) */}
                  {getNameField(firstRow) ? 'Name' : 'Main'}
                </TableCell>
                {headers.slice(1).map((header) =>
                  header === statusKey ? null : (
                    <TableCell
                      key={header}
                      isHeader
                      className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      {header.charAt(0).toUpperCase() + header.slice(1)}
                    </TableCell>
                  )
                )}
                {statusKey && (
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {pagedData.map((row) => {
                const image = getImageField(row)
                const name = getNameField(row)
                const desc = getDescriptionField(row)
                const status = getStatusField(row)
                const isHighlighted = highlightedIds.includes(getId(row))
                return (
                  <TableRow
                    key={getId(row)}
                    className={
                      isHighlighted ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''
                    }
                  >
                    {/* First column: image, name, desc */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        {image && (
                          <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                            <img src={image} className="h-[50px] w-[50px]" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {name || '-'}
                          </p>
                          {desc && (
                            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                              {desc}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    {/* Other columns */}
                    {headers.slice(1).map((header) => {
                      if (header === statusKey) return null
                      // Don't repeat name/desc/image
                      if (
                        [image, name, desc].some(
                          (val) => val && row[header] === val
                        )
                      )
                        return null
                      return (
                        <TableCell
                          key={header}
                          className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"
                        >
                          {typeof row[header] === 'boolean'
                            ? row[header]
                              ? 'Yes'
                              : 'No'
                            : row[header] ?? '-'}
                        </TableCell>
                      )
                    })}
                    {/* Status column */}
                    {statusKey && status && (
                      <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <Badge size="sm" color={getBadgeColor(status.value)}>
                          {status.value}
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Paging controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        <div />
      </div>
      {/* Modal for search/filter */}
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        className="max-w-[500px] p-6 lg:p-10"
      >
        <div className="flex flex-col gap-6">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Filter
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {tableName}
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Search
            </label>
            <input
              type="text"
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              placeholder="Type to search..."
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Rows per page
            </label>
            <select
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              value={pendingRows}
              onChange={(e) => setPendingRows(Number(e.target.value))}
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 rounded-lg border border-brand-300 bg-brand-500 text-white font-medium shadow-theme-xs hover:bg-brand-600"
              onClick={handleGo}
            >
              Go
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
