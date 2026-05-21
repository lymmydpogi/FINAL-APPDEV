import { login } from '../../services/authApi';

export async function userLogin({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return login(username, password);
}
