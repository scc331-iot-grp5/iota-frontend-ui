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
  if (typeof o !== 'object') {
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
