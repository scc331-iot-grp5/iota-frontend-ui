import * as React from 'react';
import { dataAPI } from 'redux/data-api';
import Head from 'next/head';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import Edit from '../components/edit-user-detail';
import AppBar from '../components/app-bar';
import Bottomnav from '../components/bottom-nav';

/**
 * @return {JSX.Element} a
 */
export default function BasicTable() {
  const { data: users } = dataAPI.endpoints.listUsers.useQuery(null, {
    pollingInterval: 5000,
  });
  return (
    <React.Fragment>
      <Head>
        <title>IOTA: Device Configuration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Is Admin</TableCell>
              <TableCell>Edit Detail</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users?.map((u) => (
              <TableRow
                key={u.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {u.id}
                </TableCell>
                <TableCell align="right">{u.display_name}</TableCell>
                <TableCell align="right">{u.email}</TableCell>
                <TableCell align="right">{u.is_administrator}</TableCell>

                <TableCell>
                  <Edit />
                </TableCell>
                <TableCell>
                  <IconButton>
                    <Icons.Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Bottomnav />
    </React.Fragment>
  );
}
