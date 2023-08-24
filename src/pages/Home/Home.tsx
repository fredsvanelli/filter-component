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

const MOCKED_SIMPLE_FILTERS = [
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

const MOCKED_SIMPLE_ROWS = [
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
]

const Home: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<selectedFiltersType>(
    {},
  )
  const [selectedFilters2, setSelectedFilters2] = useState<selectedFiltersType>(
    {},
  )
  const [selectedFilters3, setSelectedFilters3] = useState<selectedFiltersType>(
    {},
  )
  const [selectedFilters4, setSelectedFilters4] = useState<selectedFiltersType>(
    {},
  )

  return (
    <>
      <div>
        <h1>Default</h1>
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
      </div>
      <div>
        <h1>Search</h1>
        <div style={{ width: '300px', marginBottom: 60 }}>
          <Filter
            withSearch
            options={MOCKED_FILTERS}
            onChange={setSelectedFilters2}
          />
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
              const statusFilter = selectedFilters2.status?.length
                ? selectedFilters2.status.includes(row.status)
                : true

              const roleFilter = selectedFilters2.role?.length
                ? selectedFilters2.role.includes(row.role)
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
          {Object.keys(selectedFilters2).map((key) => (
            <>
              <p key={key}>{key}</p>
              <ul>
                {selectedFilters2[key].map((item) => (
                  <li key={String(item)}>{String(item)}</li>
                ))}
              </ul>
            </>
          ))}
        </div>
      </div>
      <div>
        <h1>With counter</h1>
        <div style={{ width: '300px', marginBottom: 60 }}>
          <Filter
            withCounter
            options={MOCKED_FILTERS}
            onChange={setSelectedFilters3}
          />
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
              const statusFilter = selectedFilters3.status?.length
                ? selectedFilters3.status.includes(row.status)
                : true

              const roleFilter = selectedFilters3.role?.length
                ? selectedFilters3.role.includes(row.role)
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
          {Object.keys(selectedFilters3).map((key) => (
            <>
              <p key={key}>{key}</p>
              <ul>
                {selectedFilters3[key].map((item) => (
                  <li key={String(item)}>{String(item)}</li>
                ))}
              </ul>
            </>
          ))}
        </div>
      </div>
      <div>
        <h1>Without sub itens</h1>
        <div style={{ width: '300px', marginBottom: 60 }}>
          <Filter
            withCounter
            options={MOCKED_SIMPLE_FILTERS}
            onChange={setSelectedFilters4}
          />
        </div>
        <table border={1} width="50%">
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {MOCKED_SIMPLE_ROWS.filter((row) =>
              Object.keys(selectedFilters4).length > 0
                ? Object.keys(selectedFilters4).includes(row.value)
                : true,
            ).map((row) => (
              <tr>
                <td>{row.label}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          {Object.keys(selectedFilters4).map((key) => (
            <>
              <p key={key}>{key}</p>
              <ul>
                {selectedFilters4[key].map((item) => (
                  <li key={String(item)}>{String(item)}</li>
                ))}
              </ul>
            </>
          ))}
        </div>
      </div>
    </>
  )
}

export default memo(Home)
