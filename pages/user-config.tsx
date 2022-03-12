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
  Avatar,
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
  const { data: devices } = dataAPI.endpoints.listDevices.useQuery(
    {},
    { pollingInterval: 5000 }
  );
  return (
    <React.Fragment>
      <Head>
        <title>IOTA: User Configuration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell></TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Is Admin</TableCell>
              <TableCell>
                <Edit devices={devices ?? []} />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users?.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>

                <TableCell>{u.display_name}</TableCell>

                <TableCell>
                  <Avatar src={u.profile_url ? u.profile_url : undefined} />
                </TableCell>

                <TableCell>{u.email}</TableCell>

                <TableCell>
                  {u.is_administrator ? (
                    <Icons.CheckCircle />
                  ) : (
                    <Icons.DoNotDisturb />
                  )}
                </TableCell>

                <TableCell>
                  <Edit user={u} devices={devices ?? []} />
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
