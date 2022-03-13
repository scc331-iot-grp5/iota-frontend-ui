import * as React from 'react';
import { dataAPI } from 'redux/data-api';
import Head from 'next/head';
import {
  Box,
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
import Edit from '../components/modals/user-config';
import AppBar from '../components/app-bar';

/**
 * @return {JSX.Element} a
 */
export default function BasicTable() {
  const { data: users } = dataAPI.endpoints.listUsers.useQuery(null, {
    pollingInterval: 2000,
  });
  const { data: devices } = dataAPI.endpoints.listDevices.useQuery(
    {},
    { pollingInterval: 5000 }
  );
  const { data: readRights } = dataAPI.endpoints.getReadRights.useQuery(
    {},
    { pollingInterval: 2000 }
  );

  const [deleteUser] = dataAPI.endpoints.deleteUser.useMutation();
  const handleDelete = (id: number) => () => {
    deleteUser(id);
  };
  return (
    <>
      <Head>
        <title>IOTA: User Configuration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <Box sx={{ flexGrow: 1 }} margin={2}>
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
                    <Avatar src={u.profile_url || undefined} />
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
                    <Edit
                      user={u}
                      devices={devices ?? []}
                      readRights={readRights?.filter((r) => r.user_id === u.id)}
                    />
                    <IconButton>
                      <Icons.Remove onClick={handleDelete(u.id)} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
