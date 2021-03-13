import React, { useContext } from 'react'
import { ThemeProvider } from 'styled-components'
import Page from './Page'

const PageNotFound: React.FC<{}> = () => {
  return <Page>404: Not found</Page>
}

export default PageNotFound
