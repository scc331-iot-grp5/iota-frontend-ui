import * as React from 'react';
import Head from 'next/head';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import AppBar from '../components/app-bar';
import LineBar from '../components/charts/bar-chart';
import Scatter from '../components/charts/scatter-chart';
import Line from '../components/charts/line-chart';
import Pie from '../components/charts/pie-chart';

/**
 * @return {JSX.Element} Charts DropDown
 */
export default function DropDown() {
  return (
    <React.Fragment>
      <Head>
        <title>IOTA: Charts Preview</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <Box sx={{ flexGrow: 1 }} margin={2}>
        <Accordion>
          <AccordionSummary expandIcon={<Icons.ExpandMore />}>
            <Typography>Bar/line chart </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <LineBar />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<Icons.ExpandMore />}>
            <Typography>Scatter chart</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Scatter />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<Icons.ExpandMore />}>
            <Typography>line chart</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Line />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<Icons.ExpandMore />}>
            <Typography>pie chart</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Pie />
          </AccordionDetails>
        </Accordion>
      </Box>
    </React.Fragment>
  );
}
