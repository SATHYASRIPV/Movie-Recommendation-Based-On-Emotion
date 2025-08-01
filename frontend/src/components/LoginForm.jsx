import { useState } from "react";
import api from "../api";
import { Navigate, useNavigate } from "react-router-dom";
import { ACCESS_TOKENS, REFRESH_TOKENS } from "../constants";
import "../styles/Form.css"
import LoadingIndicator from "./LoadingIndicator";

export const LoginForm = ({ route, method }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const name = method === 'login'? 'Login':'Register'

    const handleSubmit = async(e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const res = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKENS, res.data.access)
                localStorage.setItem(REFRESH_TOKENS, res.data.refresh)
                navigate("/")
            }
            else navigate("/login")
            
        }
        catch (error) { alert(error)
        }
        finally {
            setLoading(false)
        }
    }
    
    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text" value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required    
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">{ name }</button>
        </form>
    )
}

