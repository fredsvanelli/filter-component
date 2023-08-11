import { memo, useState } from 'react'

import Filter from 'components/Filter/Filter'

const MOCKED_FILTERS = [
  {
    label: 'Filter A',
    value: 'filter-a',
    items: [
      {
        label: 'A 1',
        value: 'a-1',
      },
      {
        label: 'A 2',
        value: 'a-2',
      },
      {
        label: 'A 3',
        value: 'a-3',
      },
    ],
  },
  {
    label: 'Filter B',
    value: 'filter-b',
    items: [
      {
        label: 'B 1',
        value: 'b-1',
      },
      {
        label: 'B 2',
        value: 'b-2',
      },
    ],
  },
]

const Home: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<(number | string)[]>(
    [],
  )

  return (
    <div style={{ width: '300px' }}>
      <Filter
        options={MOCKED_FILTERS}
        onChange={(values) => setSelectedFilters(values)}
      />
      {selectedFilters.map((filter) => (
        <p key={filter}>{filter}</p>
      ))}
    </div>
  )
}

export default memo(Home)
