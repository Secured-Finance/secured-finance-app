import React, { ErrorInfo } from 'react'

interface State {
  hasError: boolean
  error?: any
  errorInfo?: ErrorInfo
}

export default class ErrorBoundary extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true, error, errorInfo })
    console.error(`${error.name}: ${error.message}`, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // TODO: Add some nice error page.
      // use ThemeProvider
      return (
        <div>
          <h1>Something went wrong</h1>
          <h2>Please refresh the page</h2>
        </div>
      )
    }
    return this.props.children
  }
}
