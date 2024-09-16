import { LoginForm } from "../components/LoginForm"

export const Login = () => {
    return <LoginForm route="/api/token/" method="login" />
}