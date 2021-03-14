import React, { ErrorInfo } from 'react'
import ErrorPage from '../Page/ErrorPage'

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
      return <ErrorPage />
    }
    return this.props.children
  }
}
