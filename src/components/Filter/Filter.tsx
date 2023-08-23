/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { CSSProperties, memo, useCallback, useMemo, useState } from 'react'

type OptionValueType = number | string | boolean

type FilterOptionType = {
  label: string
  value: string
  items: {
    label: string
    value: OptionValueType
  }[]
}

export type selectedFiltersType = {
  [key: string]: OptionValueType[]
}

interface IFilterProps {
  options: FilterOptionType[]
  onChange: (selectedFilters: selectedFiltersType) => void
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
}

const clickableStyle: CSSProperties = {
  cursor: 'pointer',
}

const Filter: React.FC<IFilterProps> = ({ options, onChange }) => {
  const [openedOptions, setOpenedOptions] = useState<OptionValueType[]>([])
  const [selectedFilters, setSelectedFilters] = useState<selectedFiltersType>(
    {},
  )

  // handle click on parent filter bar
  const handleToggleOption = useCallback(
    (value: OptionValueType) => {
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
    (parentValue: string) => {
      const newSelectedFilters = { ...selectedFilters }

      // if option is already on the list, remove it
      if (newSelectedFilters[parentValue]) {
        delete newSelectedFilters[parentValue]
      } else {
        // if option is not on the list, add it
        newSelectedFilters[parentValue] = []

        // Check all sub items
        options
          .find((option) => option.value === parentValue)
          ?.items.forEach((item) => {
            newSelectedFilters[parentValue].push(item.value)
          })
      }

      setSelectedFilters(newSelectedFilters)
      onChange(newSelectedFilters)
    },
    [onChange, options, selectedFilters],
  )

  // handle check/uncheck of sub item checkbox
  const handleChangeItem = useCallback(
    (value: OptionValueType, parent: string) => {
      const newSelectedFilters = { ...selectedFilters }

      // if option is already on the list, remove it
      if (newSelectedFilters[parent]?.includes(value)) {
        newSelectedFilters[parent].splice(
          newSelectedFilters[parent].indexOf(value),
          1,
        )

        // if all sub items are unchecked, remove parent from list
        if (newSelectedFilters[parent].length === 0) {
          delete newSelectedFilters[parent]
        }
      } else {
        // if option is not on the list, add it
        if (!newSelectedFilters[parent]) {
          newSelectedFilters[parent] = []
        }

        newSelectedFilters[parent].push(value)
      }

      setSelectedFilters(newSelectedFilters)
      onChange(newSelectedFilters)
    },
    [onChange, selectedFilters],
  )

  const renderOptions = useMemo(
    () =>
      options?.map((option) => (
        <div key={String(option.value)}>
          {/* START Parent item */}
          <div style={optionStyle}>
            <input
              type="checkbox"
              style={clickableStyle}
              checked={!!selectedFilters[option.value]}
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
                  <div key={String(item.value)} style={itemStyle}>
                    <input
                      type="checkbox"
                      style={clickableStyle}
                      checked={selectedFilters[option.value]?.includes(
                        item.value,
                      )}
                      onChange={() =>
                        handleChangeItem(item.value, option.value)
                      }
                    />
                    <span
                      style={clickableStyle}
                      onClick={() => handleChangeItem(item.value, option.value)}
                    >
                      {item.label}
                    </span>
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
