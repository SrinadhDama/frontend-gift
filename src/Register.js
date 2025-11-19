import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

import './Register.css';
function Register(){

    const[formData,setFormData]=useState({
        username:'',
        email:'',
        password:'',
        confirmPassword:'',
        mobilenumber:''
    });
    const navigate = useNavigate();

    const [RegisterMessage, setRegisterMessage] = useState('');
    const handleChange = (e) =>{
        setFormData({...formData,[e.target.name]:e.target.value});
        setRegisterMessage('');
    } 

    const handleSubmit = async (e)=>{
        e.preventDefault();

        if(formData.password !== formData.confirmPassword){
            setRegisterMessage("Password and Confirm Password do not match");
            return;
        }
        try {
            const response = await fetch("http://localhost:8080/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const message = await response.text();
            setRegisterMessage(message);

            if(response.ok){
                setTimeout(()=>navigate("/login"),2000);
            }

         }catch(error){
            console.error("Error registering user:", error);
            alert("Registration failed");
         }
    };
    return(
        <div className="register-container">
            
            <form className="register-form"onSubmit={handleSubmit}>
                <h2>Create your Account here</h2>
                {RegisterMessage && <h3 style={{ color: 'red' }}>{RegisterMessage}</h3>}

                <label>UserName:</label>
                <input name="username" type="text" value={formData.username} onChange={handleChange} />
                <label>Email:</label>
                <input name="email" value={formData.email} onChange={handleChange} />
                <label>Password:</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} />
                <label>ConfirmPassword:</label>
                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange}/>
                <label>Mobile</label>
                <input name="mobilenumber" value={formData.mobilenumber} onChange={handleChange} />

                <button type="submit">Register</button>

                <Link to="/login" style={{ textDecoration: 'none', color: 'blue', cursor: 'pointer' }}>
                    Already have an account? <span style={{ color: 'blue', fontWeight: 'bold' }}>Sign in</span>
                </Link>
            </form>
        </div>
    );
}

export default Register;