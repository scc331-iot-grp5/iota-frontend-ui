import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '../components/modalAndChipAnddrop';
import Button from '@mui/material/Button';
import * as D from '../types/device';

interface State {
  devices: D.Device[];
  device_types: D.Type[];
} 




function createData(
    id: number,
    CustomName: string,
    Type: string,
    
    
  )
 {
  return { id, CustomName, Type };
}

const rows = [
  createData(1000, "busMicrobit", "bus"),
  createData(1111, "-", "human"),
  createData(2222, "humanMicrobit", "car"),
  createData(3333, "CustomName", "bus"),
  createData(4444, "-", "car"),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell >Configuration</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.CustomName}</TableCell>
              <TableCell align="right">{row.Type}</TableCell>
              
              <Modal/>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
