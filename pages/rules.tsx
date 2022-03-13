import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import RuleModal from '../components/modals/rule-config';

const createData = (number: number, rule: string) => ({ number, rule });

const rows = [
  createData(1, 'car crash'),
  createData(2, 'off limit'),
  createData(3, 'rule example'),
  createData(4, 'rule example'),
  createData(5, 'rule example'),
];

/**
 * @return {JSX.Element} rules table
 */
export default function RulesTable(): JSX.Element {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rule number</TableCell>
            <TableCell align="right">Rule</TableCell>
            <TableCell align="right">
              <RuleModal />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.number}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.number}
              </TableCell>
              <TableCell align="right">{row.rule}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
