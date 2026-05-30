import { useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
function Signup() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const handleSignup=async(e)=>{
    e.preventDefault();
    try {
        setLoading(true);
        const response = await axios.post(
            "http://localhost:5000/api/auth/signup",
            formData
        );
        console.log(response.data);
        navigate("/login");
    } catch (error) {
        console.log(error);
        alert("Signup failed");
    }finally{
        setLoading(false);
    }

  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-[400px]">

        <h1 className="text-3xl font-bold text-center mb-6">
          Signup
        </h1>

        <form className="space-y-4" onSubmit={handleSignup}>

          <input
            type="text"
            placeholder="Enter Name"
            className="w-full border p-3 rounded-lg"
            value={formData.name}
            onChange={(e)=>
                setFormData({
                    ...formData,
                    name:e.target.value,
                })
            }
          />

          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border p-3 rounded-lg"
            value={formData.email}
            onChange={(e)=>
                setFormData({
                    ...formData,
                    email:e.target.value,
                })
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border p-3 rounded-lg"
            value={formData.password}
            onChange={(e)=>
                setFormData({
                    ...formData,
                    password:e.target.value,
                })
            }
          />

          <button
            disabled={loading}
            className="bg-black text-white w-full py-3 rounded-lg"
          >
            {loading?"creating account":"signup"}
          </button>

        </form>
        <p className="mt-5">
            {JSON.stringify(formData)}
        </p>
      </div>

    </div>

  );
}

export default Signup;