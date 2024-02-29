import { useDispatch, useSelector } from 'react-redux';
import { login, logout, admin } from '../redux/authSlice';
import { doc, getDoc } from "firebase/firestore"; 
import firestore from '../firebase';
import { useNavigate  } from 'react-router-dom';

export const LoginButton = ({text, username, password, onClick}) => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuthenticated)
  const navigate = useNavigate ();


  const handleLogin = async () => {
    const response = await fetch(`http://localhost:3000/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password}),
    });

    const data = await response.json();


    if(username !== 'admin' && password !== "admin"){
      if(data.status){
        dispatch(login({username: username}))

        navigate("/");
      }else{
        dispatch(logout())
        onClick()
      }
    }else{
      dispatch(admin())
      navigate("/adminPanel");
    }
  }



  return (
    <div>
      <button className={'bg-black w-full h-[40px] rounded-[15px] uppercase font-bold hover:border hover:border-white'} onClick={handleLogin}>{text}</button>
    </div>
  );
};

