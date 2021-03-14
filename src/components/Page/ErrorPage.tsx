import styled from 'styled-components'
import theme from '../../theme'

const ErrorPage = () => (
  <StyledErrorInfo color={theme.colors.red} theme={theme}>
    <h1 style={{ margin: 0, padding: '2rem' }}>Something went wrong</h1>
    <StyledButton
      onClick={() => {
        window.location.replace('/')
      }}
    >
      Refresh Page
    </StyledButton>
  </StyledErrorInfo>
)

const StyledErrorInfo = styled.div`
  height: 100vh;
  text-align: center;
  padding: 0rem;
  color: ${props => props.color ?? 'red'};
  background-color: ${props => props.theme?.colors.background ?? '#0F1A22'};
`

const StyledButton = styled.button`
  padding: 1rem 2rem;
`

export default ErrorPage
