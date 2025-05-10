import { Models } from 'node-appwrite';
const isAdmin = (user: Models.User<Models.Preferences> | null) =>
  user && user.labels.includes('admin');

export const isPostittaja = (user: Models.User<Models.Preferences> | null) =>
  user && user.labels.includes('postittaja');

export default isAdmin;
