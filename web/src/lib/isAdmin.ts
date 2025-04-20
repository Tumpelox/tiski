import { Models } from 'node-appwrite';
const isAdmin = (user: Models.User<Models.Preferences> | null) =>
  user && user.labels.includes('admin');

export default isAdmin;
