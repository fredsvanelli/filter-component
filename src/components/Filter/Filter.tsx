/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { CSSProperties, memo, useCallback, useMemo, useState } from 'react'

type FilterOptionType = {
  label: string
  value: string | number
  items: {
    label: string
    value: string | number
  }[]
}

interface IFilterProps {
  options: FilterOptionType[]
  onChange: (selectedFilters: (number | string)[]) => void
}

const filterContainerStyle: CSSProperties = {
  backgroundColor: '#fff',
  color: '#333',
  padding: '1rem',
  borderRadius: '0.5rem',
}

const listContainerStyle: CSSProperties = {
  maxHeight: '210px',
  overflowY: 'scroll',
}

const optionStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.5rem',
  cursor: 'pointer',
  padding: '0.5rem',
  backgroundColor: '#eee',
}

const optionLabelStyle: CSSProperties = {
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
}

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '0.5rem',
  padding: '0.5rem',
  borderBottom: '1px solid #ccc',
  cursor: 'pointer',
}

const Filter: React.FC<IFilterProps> = ({ options, onChange }) => {
  const [openedOptions, setOpenedOptions] = useState<(number | string)[]>([])
  const [selectedFilters, setSelectedFilters] = useState<(number | string)[]>(
    [],
  )

  // handle click on parent filter bar
  const handleToggleOption = useCallback(
    (value: number | string) => {
      const newOpenedOptions = [...openedOptions]

      // if option is already on the opened list, remove it
      if (newOpenedOptions.includes(value)) {
        newOpenedOptions.splice(newOpenedOptions.indexOf(value), 1)
      } else {
        // if option is not on the opened list, add it
        newOpenedOptions.push(value)
      }

      setOpenedOptions(newOpenedOptions)
    },
    [openedOptions],
  )

  // handle check/uncheck of parent filter checkbox
  const handleChangeParent = useCallback(
    (value: number | string) => {
      const newSelectedFilters = [...selectedFilters]

      if (newSelectedFilters.includes(value)) {
        // if option is already on the list, remove it
        newSelectedFilters.splice(newSelectedFilters.indexOf(value), 1)

        // Uncheck all sub items
        options?.forEach((option) => {
          if (option.value === value) {
            option.items.forEach((item) => {
              if (newSelectedFilters.includes(item.value)) {
                newSelectedFilters.splice(
                  newSelectedFilters.indexOf(item.value),
                  1,
                )
              }
            })
          }
        })
      } else {
        // if option is not on the list, add it
        newSelectedFilters.push(value)

        // Check all sub items
        options?.forEach((option) => {
          if (option.value === value) {
            option.items.forEach((item) => {
              if (!newSelectedFilters.includes(item.value)) {
                newSelectedFilters.push(item.value)
              }
            })
          }
        })
      }

      setSelectedFilters(newSelectedFilters)
      onChange(newSelectedFilters)
    },
    [onChange, options, selectedFilters],
  )

  // handle check/uncheck of sub item checkbox
  const handleChangeItem = useCallback(
    (value: number | string, parent: FilterOptionType) => {
      const newSelectedFilters = [...selectedFilters]

      if (newSelectedFilters.includes(value)) {
        // if option is already on the list, remove it
        newSelectedFilters.splice(newSelectedFilters.indexOf(value), 1)

        // if all sub items are unchecked, remove parent from list
        if (
          parent.items
            .map((item) => item.value)
            .filter((item) => newSelectedFilters.includes(item)).length === 0
        ) {
          newSelectedFilters.splice(newSelectedFilters.indexOf(parent.value), 1)
        }
      } else {
        // if option is not on the list, add it
        newSelectedFilters.push(value)

        // add parent to list if not already there
        newSelectedFilters.push(parent.value)
      }

      // remove possible duplicates from the list
      const filteredSelectedValues = newSelectedFilters.filter(
        (item, index) => {
          return newSelectedFilters.indexOf(item) === index
        },
      )

      setSelectedFilters(filteredSelectedValues)
      onChange(filteredSelectedValues)
    },
    [onChange, selectedFilters],
  )

  const renderOptions = useMemo(
    () =>
      options?.map((option) => (
        <div key={option.value}>
          {/* START Parent item */}
          <div style={optionStyle}>
            <input
              type="checkbox"
              checked={
                selectedFilters.includes(option.value) ||
                option.items.some((item) =>
                  selectedFilters.includes(item.value),
                )
              }
              onChange={() => handleChangeParent(option.value)}
            />
            <div
              style={optionLabelStyle}
              onClick={() => handleToggleOption(option.value)}
            >
              <span>{option.label}</span>
              <span>{openedOptions.includes(option.value) ? '▲' : '▼'}</span>
            </div>
          </div>
          {/* END Parent item */}
          {openedOptions.includes(option.value) && (
            <div>
              {option.items.map((item) => (
                <>
                  {/* START sub item */}
                  <div
                    key={item.value}
                    style={itemStyle}
                    onClick={() => handleChangeItem(item.value, option)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(item.value)}
                      onChange={() => handleChangeItem(item.value, option)}
                    />
                    <span>{item.label}</span>
                  </div>
                  {/* END sub item */}
                </>
              ))}
            </div>
          )}
        </div>
      )),
    [
      handleChangeItem,
      handleChangeParent,
      handleToggleOption,
      openedOptions,
      options,
      selectedFilters,
    ],
  )

  return (
    <div style={filterContainerStyle}>
      <div style={listContainerStyle}>{renderOptions}</div>
    </div>
  )
}

export default memo(Filter)
