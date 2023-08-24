/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { CSSProperties, memo, useCallback, useMemo, useState } from 'react'

type OptionValueType = number | string | boolean

type FilterOptionType = {
  label: string
  value: string
  items?: {
    label: string
    value: OptionValueType
  }[]
}

export type selectedFiltersType = {
  [key: string]: OptionValueType[]
}

interface IFilterProps {
  options: FilterOptionType[]
  withSearch?: boolean
  withCounter?: boolean
  onChange: (selectedFilters: selectedFiltersType) => void
}

const filterContainerStyle: CSSProperties = {
  backgroundColor: '#fff',
  color: '#333',
  padding: '1rem',
  borderRadius: '0.5rem',
}

const searchInputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
}

const listContainerStyle: CSSProperties = {
  maxHeight: '210px',
  overflowY: 'scroll',
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

const Filter: React.FC<IFilterProps> = ({
  options,
  withSearch = false,
  withCounter = false,
  onChange,
}) => {
  const [openedOptions, setOpenedOptions] = useState<OptionValueType[]>([])
  const [selectedFilters, setSelectedFilters] = useState<selectedFiltersType>(
    {},
  )
  const [searchValue, setSearchValue] = useState('')

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
          ?.items?.forEach((item) => {
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

  // check if a parent item should be shown based on the search value
  const shouldShowParentItem = useCallback(
    (parent: FilterOptionType) =>
      withSearch && searchValue
        ? parent.items?.some((item) =>
            item.label.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : true,
    [withSearch, searchValue],
  )

  // check if an option should be open
  const shouldOpenOption = useCallback(
    (option: FilterOptionType) =>
      (withSearch && searchValue) || openedOptions.includes(option.value),
    [openedOptions, withSearch, searchValue],
  )

  const selectedOptionsCounter = useMemo(
    () =>
      Object.keys(selectedFilters).reduce(
        (acc, key) => acc + Math.max(selectedFilters[key].length, 1),
        0,
      ),
    [selectedFilters],
  )

  const getOptionStyle = useCallback(
    (option: FilterOptionType) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '0.5rem',
      cursor: 'pointer',
      padding: '0.5rem',
      backgroundColor:
        Array.isArray(option.items) && option.items?.length > 0
          ? '#eee'
          : '#fff',
    }),
    [],
  )

  const renderOptions = useMemo(
    () =>
      options?.map((option) => (
        <div
          key={String(option.value)}
          style={{ display: shouldShowParentItem(option) ? 'block' : 'none' }}
        >
          {/* START Parent item */}
          <div style={getOptionStyle(option)}>
            <input
              type="checkbox"
              style={clickableStyle}
              checked={!!selectedFilters[option.value]}
              onChange={() => handleChangeParent(option.value)}
            />
            <div
              style={optionLabelStyle}
              onClick={() =>
                Array.isArray(option.items) && option.items?.length > 0
                  ? handleToggleOption(option.value)
                  : handleChangeParent(option.value)
              }
            >
              <span>{option.label}</span>
              {Array.isArray(option.items) && option.items?.length > 0 && (
                <span>{shouldOpenOption(option) ? '▲' : '▼'}</span>
              )}
            </div>
          </div>
          {/* END Parent item */}
          {shouldOpenOption(option) && (
            <div>
              {option.items
                ?.filter((item) =>
                  withSearch && searchValue
                    ? item.label
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    : true,
                )
                .map((item) => (
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
                        onClick={() =>
                          handleChangeItem(item.value, option.value)
                        }
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
      options,
      shouldShowParentItem,
      getOptionStyle,
      selectedFilters,
      shouldOpenOption,
      handleChangeParent,
      handleToggleOption,
      withSearch,
      searchValue,
      handleChangeItem,
    ],
  )

  return (
    <>
      {withCounter && selectedOptionsCounter > 0 && (
        <div>
          <p>{selectedOptionsCounter} selected</p>
        </div>
      )}
      <div style={filterContainerStyle}>
        {withSearch && (
          <input
            style={searchInputStyle}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
          />
        )}
        <div style={listContainerStyle}>{renderOptions}</div>
      </div>
    </>
  )
}

export default memo(Filter)
