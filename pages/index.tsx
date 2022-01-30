import Head from 'next/head';
import styles from '@/pages/index.module.css';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import { ArrowRight } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { UserDetails, isUserDetails } from '../types/user-details';
import { useRouter } from 'next/router';

interface State {
  showPassword: boolean;
  password: string;
  username: string;
  loading: boolean;
  userDetails: UserDetails | null;
}

/**
 * @return {JSX.Element} The Home page
 */
export default function Home(): JSX.Element {
  const router = useRouter();
  const [values, setValues] = React.useState<State>({
    showPassword: false,
    password: '',
    username: '',
    loading: false,
    userDetails: null,
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    // TODO: spinner
    window?.sessionStorage.setItem('user_details', 'null');
    fetch('http://localhost:1880/log-in', {
      method: 'POST',
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    })
      .then((res) => res.json())
      .then(
        (res) => {
          console.log('login response', res);
          if (isUserDetails(res)) {
            console.log('are user details');
            values.userDetails = res;
            window?.sessionStorage.setItem('user_details', JSON.stringify(res));
            router.push('dash');
          } else if (res === {}) {
            console.log('did not receive user details response');
          }
        },
        (err) => console.log('log-in fetch failed', err)
      );
    // TODO stop spinner
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>IOTA: Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Welcome to IOTA</h1>
        <p className={styles.description}>Please log in</p>

        <div className={styles.grid}>
          <a className={styles.card}>
            <div>
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-username">Username</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-username"
                  type="text"
                  value={values.username}
                  onChange={handleChange('username')}
                  label="Username"
                />
              </FormControl>

              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange('password')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  sx={{ m: 1 }}
                  variant="outlined"
                  endIcon={<ArrowRight />}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Box>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
