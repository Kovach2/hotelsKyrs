import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Input from '../components/input';
import { LoginButton } from '../components/LoginButton';
import { useSelector } from 'react-redux';

const Login = () => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState(false)

    const loginChange = (event) =>{
        setLogin(event.target.value)
    }

    const passwordChange = (event) =>{
        setPassword(event.target.value)
    }

    return (
        <>
            <Header/>
            <div className='flex justify-center items-center h-screen'>
                <div className='w-[400px] h-auto bg-zinc-500 rounded-[10px] p-[20px] text-center'>
                    <div className='font-bold text-[24px] mt-[20px]'>Вход</div>
                    <div className='max-w-[300px] mx-auto mt-[30px]'>
                        <Input type={'text'} labelText={"Логин"} placeholder={"Логин"} onChange={loginChange} value={login}/>
                        <Input type={'password'} labelText={"Пароль"} placeholder={"Пароль"} onChange={passwordChange} value={password}/>
                        <LoginButton text={"Войти"} username={login} password={password} onClick={()=>{setError(true)}}/>
                        
                        <div className='mt-[15px]'>Нет аккаунта? <Link to={'/register'} className='hover:text-gray-400'>Зарегистрируйтесь!</Link></div>
                        <div className={`${error ? "block" : "hidden"} mt-[15px] text-red-500`}>Не правильный логин или пароль!</div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Login;
