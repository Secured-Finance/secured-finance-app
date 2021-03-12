import { ThemeProvider } from 'styled-components'
import theme from '../src/theme/index'
import { MemoryRouter as Router } from 'react-router-dom'
import { MemoryRouter } from 'react-router'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
}

export const decorators = [
  Story => (
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <div
          style={{ display: 'flex', alignContent: 'center', padding: '1rem' }}
        >
          <Story />
        </div>
      </MemoryRouter>
    </ThemeProvider>
  ),
]
