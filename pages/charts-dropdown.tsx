import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LineBar from './components/line-bar-Chart';
import Scatter from './components/scatter-chart';
import Line from './components/line-chart';
import Pie from './components/pie-chart';
export default function SimpleAccordion() {
  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Bar/line chart </Typography>
        </AccordionSummary>
        <AccordionDetails>
         <LineBar/>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Scatter chart</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Scatter/>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>line chart</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Line/>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
        <Typography>pie chart</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Pie/>
        </AccordionDetails>
      </Accordion>
      
    </React.Fragment>
  );
}
