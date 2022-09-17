// export const setTokenInLocalStorage = (token) => {
//   localStorage.setItem('grace-shopper-jwt', JSON.stringify(token));
//   console.log('Token set.')
// }

// export const removeTokenFromLocalStorage = () => {
//   localStorage.removeItem('grace-shopper-jwt');
//   console.log('Token removed.')
// }

// export const checkLocalStorage = () => {
//   const localToken = localStorage.getItem('grace-shopper-jwt');
//   if (localToken && localToken.length > 0) {
//     console.log('Token found in storage.')
//     return localToken;
//   } else {
//     console.log('No token found in storage.')
//     return false;
//   }
// }