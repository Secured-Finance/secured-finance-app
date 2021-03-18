import styled from "styled-components";
import theme from "../../theme";

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: ${theme.sizes.caption2}px;
  margin-top: 0;
  font-weight: 500;
  margin-bottom: ${theme.spacing[2]+2}px;
`

export const Cell = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing[2]}px;
`

export const CellKey = styled.p`
    margin: 0;
    color: ${theme.colors.cellKey};
    font-size: 12px;
`

export const CellValue = styled(CellKey)`
  color: ${theme.colors.lightBackground}
`