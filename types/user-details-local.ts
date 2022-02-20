import { User } from './user';

/**
 * @return {User | null} the retrieved user details
 */
export function getUserDetails(): User | null {
  const ud = JSON.parse(
    window.sessionStorage.getItem('user_details') ?? 'null'
  );
  return !!ud ? ud : null;
}

/**
 * @param {User | null} ud
 * @return {void} nothing
 */
export function setUserDetails(ud: User | null): void {
  return window.sessionStorage.setItem('user_details', JSON.stringify(ud));
}
