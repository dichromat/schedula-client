import { useNavigate } from "react-router-dom"
import { useUserdataContext } from "../contexts/userdata-context"

export default function Login() {
    const {setUserdata} = useUserdataContext()

    const apiUrl = import.meta.env.VITE_API_URL

    const navigate = useNavigate()

    const signUp = async () => {
        const usernameInput = (document.getElementById("username-input") as HTMLInputElement).value
        const passwordInput = (document.getElementById("password-input") as HTMLInputElement).value

        const response = await fetch(`${apiUrl}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"username": usernameInput, "password": passwordInput})
        })

        const data = await response.json()
        switch (response.status) {
            case 201:
                const {iv, token} = data
                const timeString = new Date().toISOString()
                setUserdata([usernameInput, iv, token, timeString])
                navigate('/assignments')
                break
            case 409:
                const { message } = data
                if (message === "User Already Exists") {
                    console.log("User Already Exists")
                }
                else console.log("An unexpected conflict occurred")
                break
            case 500:
                const { error } = data
                console.log(error)
                break
            default:
                console.log("An unexpected error occurred")
                break
        }
    }

    const logIn = async () => {
        const usernameInput = (document.getElementById("username-input") as HTMLInputElement).value
        const passwordInput = (document.getElementById("password-input") as HTMLInputElement).value

        const response = await fetch(`${apiUrl}/login`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"username": usernameInput, "password": passwordInput})
        })

        const data = await response.json()
        switch (response.status) {
            case 200:
                const {iv, token} = data
                const timeString = new Date().toISOString()
                setUserdata([usernameInput, iv, token, timeString])
                navigate('/assignments')
                break
            case 401:
                const { message: credentialsMessage } = data
                if (credentialsMessage === "Incorrect Password") {
                    console.log("Incorrect Password")
                }
                else console.log("An unexpected conflict occurred")
                break
            case 409:
                const { message: dbContentMessage } = data
                if (dbContentMessage === "User Does Not Exist") {
                    console.log("User Does Not Exist")
                }
                else console.log("An unexpected conflict occurred")
                break
            case 500:
                const { error } = data
                console.log(error)
                break
            default:
                console.log("An unexpected error occurred")
                break
        }
    }

    return (
    <div className="container-fluid full-height">
        <div className="row">
            <div className="col-1 background-blue"></div>
            <div className="col-1"></div>
            <div className="col-8">
                <div className="container-fluid full-height">
                    <div className="row h-25 justify-content-center align-items-center">
                        <div className="col text-center welcome-text">Welcome to Schedula!</div>
                    </div>
                    <div className="row h-10 justify-content-center align-items-center">
                        <div className="col text-center">
                            <label>Username</label>
                            <input className="form-control" id="username-input" type="text"></input>
                        </div>
                    </div>
                    <div className="row h-10 justify-content-center align-items-center">
                        <div className="col text-center">
                            <label>Password</label>
                            <input className="form-control" id="password-input" type="password"></input>
                        </div>
                    </div>
                    <div className="row h-25 justify-content-center align-items-center">
                        <div className="col text-center">
                            <button onClick={signUp} className="btn btn-success">Sign Up</button>
                        </div>
                        <div className="col"></div>
                        <div className="col text-center">
                            <button onClick={logIn} className="btn btn-primary">Log In</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-1"></div>
            <div className="col-1 background-blue"></div>
        </div>
    </div>


    )
}
