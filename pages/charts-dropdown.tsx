import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import LineBar from '../components/line-bar-chart';
import Scatter from '../components/scatter-chart';
import Line from '../components/line-chart';
import Pie from '../components/pie-chart';

/**
 * @return {JSX.Element} Charts DropDown
 */
export default function DropDown() {
  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary
          expandIcon={<Icons.ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Bar/line chart </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <LineBar />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<Icons.ExpandMore />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Scatter chart</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Scatter />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<Icons.ExpandMore />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>line chart</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Line />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<Icons.ExpandMore />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>pie chart</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Pie />
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
}
