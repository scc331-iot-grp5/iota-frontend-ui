import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pop from '../components/popupbutton';
import Button from '@mui/material/Button';
import { Device } from 'types/device';
import { Type } from 'types/device';
import Edit from '../components/edit-user-detail';
// import AppBar from '@/components/app-bar';
// import { useRouter } from 'next/router';

interface State {
  devices: Device[];
  device_Type: Type[];
  // device_types: Device.Type[];
  //deviceData: Device[];
}

// function dashToDeviceGrid(dash: Device): JSX.Element {
//   const rows =[
//     { field: 'id', headerName: 'ID' },
//     { field: 'name', headerName: 'Name' },
//     { field: 'type_id', headerName: 'Type' },
//   ];
//     return(
//       rows={dash.devices.map((d, n) => ({ ...d, id: n }))}
//     )
//     }

function createData(id: number, UserName: string, Email: string) {
  return { id, UserName, Email };
}

const rows = [
  createData(1000, 'Nima', 'something@gmail.com'),
  createData(1111, '-', 'something@gmail.com'),
  createData(2222, 'Lewis', 'something@gmail.com'),
  createData(3333, 'CustomName', 'something@gmail.com'),
  createData(4444, '-', 'something@gmail.com'),
];

function fetchValues(
  values: State,
  setValues: React.Dispatch<React.SetStateAction<State>>
): void {
  fetch('http://localhost:1880/Device')
    .then((res) => res.json())
    .then(
      (res) => {
        console.log('Configuration data fetched');
        if (res === {}) {
          console.log('no data retrieved');
          return;
        }
        setValues({ ...values, devices: res });
      },
      (err) => console.log('Configuration data fetch failed', err)
    );
}

export default function BasicTable() {
  // const router = useRouter();
  // const [values, setValues] = React.useState<State>({
  //   devices: {
  //     number,
  //     string,
  //   },
  // });
  return (
    // <AppBar />
    // <Head>
    //     <title>IOTA: Configuration</title>
    //     <link rel="icon" href="/favicon.ico" />
    //   </Head>

    // <IconButton
    //     aria-label="refresh"
    //     size="small"
    //     onClick={() => fetchValues(values, setValues)}
    //   >
    //     <Refresh fontSize="small" />
    //   </IconButton>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell>Edit Detail</TableCell>
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
              <TableCell align="right">{row.UserName}</TableCell>
              <TableCell align="right">{row.Email}</TableCell>

              <Edit />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
