import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import Page from './Page'

const PageNotFound: React.FC<{}> = () => {
  const theme = useContext(ThemeContext)
  return (
    <Page>
      <h1 style={{ color: theme.colors.lightText }}>404: Page not found</h1>
    </Page>
  )
}

export default PageNotFound
