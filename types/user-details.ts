export type UserDetails = {
  username: string;
  // displayName: string;
  // email: string | null;
};

/**
 * checks that an object is user details
 * @param {any} o the object to check
 * @return {bool} if the object is UserDetails
 */
export function isUserDetails(o: any): o is UserDetails {
  if (typeof o !== 'object' || o === undefined || o === null) {
    return false;
  }

  const propNames = Object.getOwnPropertyNames(o);
  return (
    propNames.length === 1 &&
    propNames.every(
      (n) => n === 'username' // || n === 'displayName' || n === 'email'
    )
  );
}

/**
 * @return {UserDetails | null} the retrieved user details
 */
export function getUserDetails(): UserDetails | null {
  const ud = JSON.parse(
    window.sessionStorage.getItem('user_details') ?? 'null'
  );
  return isUserDetails(ud) ? ud : null;
}

/**
 * @param {UserDetails | null} ud
 * @return {void} nothing
 */
export function setUserDetails(ud: UserDetails | null): void {
  return window.sessionStorage.setItem('user_details', JSON.stringify(ud));
}
