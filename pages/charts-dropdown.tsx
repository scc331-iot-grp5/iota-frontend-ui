import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormControl,
  MenuItem,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import LineBar from '../components/bar-chart';
import Scatter from '../components/scatter-chart';
import Line from '../components/line-chart';
import Pie from '../components/pie-chart';

/**
 * @return {JSX.Element} Charts DropDown
 */

export default function DropDown() {
  const [device, setDevice] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setDevice(event.target.value as string);
  };
  return (
    <React.Fragment>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Device</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={device}
          label="Device"
          onChange={handleChange}
        >
          <MenuItem value={10}>0001</MenuItem>
          <MenuItem value={20}>0003</MenuItem>
          <MenuItem value={30}>0004</MenuItem>
        </Select>
      </FormControl>
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
