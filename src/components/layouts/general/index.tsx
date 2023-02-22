import { FC } from "react";
import type { PropsWithChildren } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Breadcrumbs, Grid, MenuItem, MenuList, Stack, Typography } from "@mui/material";
import { NavigateNext, DateRange, NotificationsNone } from "@mui/icons-material";

import pages from "configs/pages";

import {
  StyledSidebar,
  StyledContent,
  StyledNotificationButton,
  StyledCalendarButton,
  StyledCalendarButtonTitle,
} from "./styled";

const GeneralLayout: FC<PropsWithChildren> = () => {
  const { pathname } = useLocation();
  const [, path,, slug] = pathname.split("/");
  const pageName = pages.find((value) => value.path === `/${path}`);

  const renderMenuItem = () => {
    return pages
      .filter((value) => value.inSidebar)
      .map((value) => {
        const selected = value.path === `/${path}`;
        return (
          <MenuItem key={value.path} selected={selected}>
            <Link to={value.path} style={{ color: "inherit", width: "100%", textDecoration: "none" }}>
              <Typography fontWeight={selected ? 600 : 400}>{value.name}</Typography>
            </Link>
          </MenuItem>
        );
      });
  };

  return (
    <Grid container>
      <StyledSidebar>
        <Stack>
          <Stack height={80} alignItems="center" justifyContent="center" borderBottom="1px solid #E8E9EA">
            <Typography fontSize={24}>
              work
              <strong>puls</strong>
            </Typography>
          </Stack>
          <Stack py={1}>
            <MenuList>{renderMenuItem()}</MenuList>
          </Stack>
        </Stack>
      </StyledSidebar>
      <StyledContent>
        <Stack px={3} py={2} direction="row" justifyContent="space-between">
          {pageName && (
            <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext fontSize="small" />}>
              <Link to={pageName.path} style={{ color: "inherit", fontSize: 14, textDecoration: "none" }}>
                {pageName.name}
              </Link>
              {slug && (
                <Typography color="text.primary" fontSize={14} textTransform="capitalize">
                  {slug.replaceAll("-", " ")}
                </Typography>
              )}
            </Breadcrumbs>
          )}
          <Stack spacing={1} direction="row">
            <StyledNotificationButton color="primary" variant="outlined">
              <NotificationsNone />
            </StyledNotificationButton>
            <StyledCalendarButton spacing={1} direction="row" alignItems="center" justifyContent="center">
              <DateRange style={{ color: "#707F92" }} />
              <StyledCalendarButtonTitle>
                <Typography color="#707F92" fontSize={12} fontWeight={500}>
                  Total Time
                </Typography>
                <Typography color="#707F92" fontSize={10}>
                  Calendar is not available
                </Typography>
              </StyledCalendarButtonTitle>
            </StyledCalendarButton>
          </Stack>
        </Stack>
        <Stack p={3}>
          <Outlet />
        </Stack>
      </StyledContent>
    </Grid>
  );
};

export default GeneralLayout;
