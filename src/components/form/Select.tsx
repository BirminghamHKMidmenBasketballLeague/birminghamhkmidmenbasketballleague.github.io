import React, { useState, useEffect, useRef } from 'react'

export interface Option {
  value: string
  label: string
}

interface SelectProps {
  options: Option[]
  placeholder?: string
  onChange: (value: string) => void
  className?: string
  defaultValue?: string
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  defaultValue = '',
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sync with defaultValue prop
  useEffect(() => {
    setSelectedValue(defaultValue)
  }, [defaultValue])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    setIsOpen(false)
    onChange(value)
  }

  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label || ''

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      <div className="relative z-40 inline-block w-full">
        <div className="relative flex flex-col items-center">
          <div onClick={() => setIsOpen((prev) => !prev)} className="w-full">
            <div className="mb-2 flex h-11 rounded-lg border border-gray-300 py-1.5 pl-3 pr-3 shadow-theme-xs outline-none transition focus:border-brand-300 focus:shadow-focus-ring dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-300 cursor-pointer">
              <div className="flex flex-wrap flex-auto gap-2 items-center">
                {selectedLabel ? (
                  <span className="text-sm text-gray-800 dark:text-white/90">
                    {selectedLabel}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-400">
                    {placeholder}
                  </span>
                )}
              </div>
              <div className="flex items-center py-1 pl-1 pr-1 w-7">
                <button
                  type="button"
                  tabIndex={-1}
                  className="w-5 h-5 text-gray-700 outline-none cursor-pointer focus:outline-none dark:text-gray-400"
                >
                  <svg
                    className={`stroke-current ${isOpen ? 'rotate-180' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {isOpen && (
            <div
              className="absolute left-0 z-40 w-full overflow-y-auto bg-white rounded-lg shadow top-full max-h-select dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col">
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={`hover:bg-primary/5 w-full cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-b-0 ${
                      selectedValue === option.value ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => handleSelect(option.value)}
                  >
                    <div className="relative flex w-full items-center p-2 pl-2">
                      <div className="mx-2 leading-6 text-gray-800 dark:text-white/90">
                        {option.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Select
