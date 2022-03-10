import * as React from 'react';
import { dataAPI } from '../redux/data-api';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import {
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  Box,
  Button,
} from '@mui/material';
import * as Icons from '@mui/icons-material';

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

/**
 * @return {JSX.Element} The Home page
 */
export default function Home(): JSX.Element {
  const router = useRouter();
  const [values, setValues] = React.useState<State>({
    showPassword: false,
    email: '',
    password: '',
  });

  const [triggerLogin] = dataAPI.endpoints.login.useLazyQuery();

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
    triggerLogin({ email: values.email, password_hash: values.password }).then(
      (r) => {
        console.log(r);
        if (r.isSuccess) {
          window?.sessionStorage.setItem(
            'user_details',
            JSON.stringify(r.data)
          );
          router.push('dash');
        }
      }
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
                <InputLabel htmlFor="outlined-username">Email</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-username"
                  type="text"
                  value={values.email}
                  onChange={handleChange('email')}
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
                          <Icons.VisibilityOff />
                        ) : (
                          <Icons.Visibility />
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
                  endIcon={<Icons.ArrowRight />}
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
