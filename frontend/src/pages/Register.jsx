import {LoginForm} from "../components/LoginForm";


export const Register = () => {
  return(
    <LoginForm route="api/user/register/" method="register"></LoginForm>
  ) 
}