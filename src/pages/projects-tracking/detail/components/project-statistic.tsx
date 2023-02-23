import { FC, ReactNode } from "react";
import ReactCountUp from "react-countup";
import { Box, Grid, Card, CardHeader, Typography, Stack } from "@mui/material";
import { AccountBalanceWallet, ArrowDropUp, RequestQuote, ShowChart, WorkOutline } from "@mui/icons-material";

import { Project } from "store/project";

type ProjectStatisticProps = {
  totalTime?: Project["totalTime"];
  totalCosts?: Project["totalCosts"];
  productivity?: Project["productivity"];
  totalEarnings?: Project["totalEarnings"];
};

function getTimeFromMins(mins: number) {
  var h = (mins / 60) | 0,
    m = mins % 60 | 0;
  return (
    <>
      <ReactCountUp end={h} />
      :
      <ReactCountUp end={m} />
    </>
  );
}

const ProjectStatistic: FC<ProjectStatisticProps> = ({ totalTime, totalCosts, productivity, totalEarnings }) => {
  const renderTitle = (title: string, color = "text.secondary") => (
    <Typography color={color} fontWeight={700}>
      {title}
    </Typography>
  );

  const renderContent = (content: number | string | ReactNode = 0, suffix?: string, prefix?: string, extra?: ReactNode) => (
    <Stack direction="row">
      {prefix && (
        <Typography mt={0.5} mr={0.5} color="text.primary" fontSize={16} fontWeight={600}>
          {prefix}
        </Typography>
      )}
      <Typography mt={0.5} color="text.primary" fontSize={24} fontWeight={600}>
        {typeof content === "number" ? <ReactCountUp end={content} decimals={2} separator="," /> : content}
      </Typography>
      {suffix && (
        <Typography mt={0.5} ml={0.5} color="text.primary" fontSize={16} fontWeight={600}>
          {suffix}
        </Typography>
      )}
      {extra && (
        <Stack ml={2} mb={0.5} justifyContent="end">
          {extra}
        </Stack>
      )}
    </Stack>
  );

  return (
    <Grid my={2} container spacing={2}>
      <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
        <Card>
          <CardHeader
            title={renderTitle("Total time on Project")}
            action={
              <Box mx={1}>
                <WorkOutline style={{ color: "#707F92" }} />
              </Box>
            }
            subheader={renderContent(getTimeFromMins(totalTime || 0), "h")}
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
        <Card>
          <CardHeader
            title={renderTitle("Earnings")}
            action={
              <Box mx={1}>
                <RequestQuote style={{ color: "#707F92" }} />
              </Box>
            }
            subheader={renderContent(totalEarnings, undefined, "$")}
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
        <Card>
          <CardHeader
            title={renderTitle("Costs")}
            action={
              <Box mx={1}>
                <AccountBalanceWallet style={{ color: "#707F92" }} />
              </Box>
            }
            subheader={renderContent(totalCosts, undefined, "$")}
          />
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
        <Card>
          <CardHeader
            title={renderTitle("Productivity", "#349EEB")}
            action={
              <Box mx={1}>
                <ShowChart color="info" />
              </Box>
            }
            subheader={renderContent(
              productivity?.current,
              "%",
              undefined,
              <Typography color="#1CAB8A" fontWeight={700}>
                <ArrowDropUp style={{ verticalAlign: "bottom" }} color="success" />
                {productivity?.dayChange}%
              </Typography>
            )}
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProjectStatistic;
