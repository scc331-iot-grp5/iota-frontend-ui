import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import AppBar from '../components/app-bar';
import RuleModal from '../components/modals/rule-creator';
import { dataAPI } from 'redux/data-api';
import { getUserDetails } from 'types/user-details-local';

/**
 * @return {JSX.Element} rules table
 */
export default function RulesTable(): JSX.Element {
  const router = useRouter();
  const userDetails = getUserDetails();
  if (userDetails === null) {
    router.push('/');
    return (
      <div>
        <p>
          You&apos;re not logged in, redirecting... If you are not redirected in
          5 seconds please click <Link href="/">here</Link>
        </p>
      </div>
    );
  }

  const { data: devices } = dataAPI.endpoints.listDevices.useQuery(
    {},
    { pollingInterval: 5000 }
  );
  const { data: deviceTypes } = dataAPI.endpoints.listDeviceTypes.useQuery(
    null,
    { pollingInterval: 5000 }
  );
  const { data: rules } = dataAPI.endpoints.listRules.useQuery(
    {},
    { pollingInterval: 2000 }
  );
  const { data: zones } = dataAPI.endpoints.listZones.useQuery(null, {
    pollingInterval: 5000,
  });
  const { data: zoneGroups } = dataAPI.endpoints.listZoneGroups.useQuery(null, {
    pollingInterval: 5000,
  });
  const { data: zoneGroupVars } = dataAPI.endpoints.listZoneVars.useQuery(
    null,
    { pollingInterval: 5000 }
  );
  const [deleteRule] = dataAPI.endpoints.deleteRule.useMutation();

  const handleDeleteRule = (ruleId: number) => () => {
    deleteRule(ruleId);
  };
  return (
    <>
      <Head>
        <title>IOTA: Rule Configuration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar />

      <Box sx={{ flexGrow: 1 }} margin={2}>
        <Typography variant="h6">Rules</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>
                  <RuleModal
                    userId={userDetails.id}
                    devices={devices ?? []}
                    deviceTypes={deviceTypes ?? []}
                    zones={zones ?? []}
                    zoneGroups={zoneGroups ?? []}
                    zoneGroupVars={zoneGroupVars ?? []}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules?.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={handleDeleteRule(row.id)}>
                      <Icons.Remove />
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
