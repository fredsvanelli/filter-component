import { memo, useState } from 'react'

import Filter, { selectedFiltersType } from 'components/Filter/Filter'

const MOCKED_FILTERS = [
  {
    label: 'Status',
    value: 'status',
    items: [
      {
        label: 'Ativo',
        value: 'active',
      },
      {
        label: 'Inativo',
        value: 'inactive',
      },
    ],
  },
  {
    label: 'Cargo',
    value: 'role',
    items: [
      {
        label: 'A',
        value: 'a',
      },
      {
        label: 'B',
        value: 'b',
      },
      {
        label: 'C',
        value: 'c',
      },
    ],
  },
]

const MOCKED_ROWS = [
  {
    name: 'João',
    status: 'active',
    role: 'a',
  },
  {
    name: 'Maria',
    status: 'active',
    role: 'b',
  },
  {
    name: 'José',
    status: 'inactive',
    role: 'c',
  },
]

const Home: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<selectedFiltersType>(
    {},
  )

  return (
    <>
      <div style={{ width: '300px', marginBottom: 60 }}>
        <Filter options={MOCKED_FILTERS} onChange={setSelectedFilters} />
      </div>
      <table border={1} width="50%">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Status</th>
            <th>Cargo</th>
          </tr>
        </thead>
        <tbody>
          {MOCKED_ROWS.filter((row) => {
            const statusFilter = selectedFilters.status?.length
              ? selectedFilters.status.includes(row.status)
              : true

            const roleFilter = selectedFilters.role?.length
              ? selectedFilters.role.includes(row.role)
              : true

            return statusFilter && roleFilter
          }).map((row) => (
            <tr>
              <td>{row.name}</td>
              <td>{row.status}</td>
              <td>{row.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Object.keys(selectedFilters).map((key) => (
          <>
            <p key={key}>{key}</p>
            <ul>
              {selectedFilters[key].map((item) => (
                <li key={String(item)}>{String(item)}</li>
              ))}
            </ul>
          </>
        ))}
      </div>
    </>
  )
}

export default memo(Home)
