import styled from "@emotion/styled";
import { Box, Button, Stack } from "@mui/material";

export const StyledSidebar = styled(Stack)`
  height: 100vh;
  display: none;
  position: fixed;
  min-width: 280px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);

  @media screen and (min-width: 900px) {
    display: grid;
  }
`;

export const StyledContent = styled(Stack)`
  width: 100%;

  @media screen and (min-width: 900px) {
    width: calc(100% - 280px);
    margin-left: 280px;
  }
`;

export const StyledNotificationButton = styled(Button)`
  height: 48px;
  padding: 0px;
  min-width: 48px;
  border-radius: 100px;
`;

export const StyledCalendarButton = styled(Stack)`
  width: 48px;
  cursor: pointer;
  height: 48px;
  padding: 0px;
  border-radius: 100px;
  background-color: #F0F0F0;

  @media screen and (min-width: 600px) {
    width: max-content;
    padding: 4px 16px;
  }
`;

export const StyledCalendarButtonTitle = styled(Box)`
  display: none;

  @media screen and (min-width: 600px) {
    display: block;
  }
`;
