import Button from '@mui/material/Button';
import { Login as LoginIcon } from '@mui/icons-material';

/**
 * @return {JSX.Element} the login page
 */
export default function Dash(): JSX.Element {
  return (
    <div>
      <Button variant="contained" endIcon={<LoginIcon />}>
        Hello World
      </Button>
    </div>
  );
}
