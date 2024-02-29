import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice'

import firestore from '../firebase';

import generateRandomString from '../components/functions/generateRandomString';


import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/input';
import Header from '../components/header';
import { doc, updateDoc, getDoc } from 'firebase/firestore';


const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [data, setData] = useState({login: "", password: "", repeatPassword: ""})
    const [errors, setErrors] = useState({login: "", password: "", repeatPassword: ""})

    useEffect(()=>{
        if(data.password !== data.repeatPassword){
            setErrors((prevData) => ({
                ...prevData,
                repeatPassword: "Пароли не совпадают!"
            }))
        }else{
            setErrors((prevData) => ({
                ...prevData,
                repeatPassword: ""
            }))
        }
    },[data.repeatPassword, data.password])

    useEffect(()=>{
        if(data.password.length < 4 && data.password.length !== 0){
            setErrors((prevData) => ({
                ...prevData,
                password: "Пароль должен содержать минимум 4 символа!"
            }))
        }else if(data.password.length > 24){
            setErrors((prevData) => ({
                ...prevData,
                password: "Пароль должен содержать максимум 24 символа!"
            }))
        }else{
            setErrors((prevData) => ({
                ...prevData,
                password: ""
            }))
        }
    },[data.password])

    useEffect(()=>{
        if(data.login.length < 4 && data.login.length !== 0){
            setErrors((prevData) => ({
                ...prevData,
                login: "Логин должен содержать минимум 4 символа"
            }))
        }else if(data.login.length >= 13){
            setErrors((prevData) => ({
                ...prevData,
                login: "Логин должен содержать максимум 12 символов"
            }))
        }else if(/\s/.test(data.login)){
            setErrors((prevData) => ({
                ...prevData,
                login: "Уберите пробелы!"
            }))
        }else if(!/^[a-zA-Z0-9]+$/.test(data.login) && data.login.length !== 0){
            setErrors((prevData) => ({
                ...prevData,
                login: "Только латиница и цифры!"
            }))
        }else{
            setErrors((prevData) => ({
                ...prevData,
                login: ""
            }))
        }
    },[data.login])



    const handleChange = (event) =>{
        if (event.target.name === "login") {
            setData((prevData) => ({
              ...prevData,
              login: event.target.value
            }));
        }else if(event.target.name === "pass"){
            setData((prevData) => ({
                ...prevData,
                password: event.target.value
              }));
              
        }else{
            setData((prevData) => ({
                ...prevData,
                repeatPassword: event.target.value
              }));
        }
    }

    const register = async () => {
        if(!errors.login && !errors.password && !errors.repeatPassword && data.login !== "" && data.password !== "" && data.repeatPassword !== "")
        {
            const newUser = {username: data.login, password: data.password}
            try{
                const response = await fetch("http://localhost:3000/users/register",{
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json',
                      },
                    body:  JSON.stringify(newUser),
                })

                const data = await response.json();

                if(data.exist){
                    alert("Имя пользователя занято!")
                    return
                }else{
                    dispatch(login(newUser))
                    navigate("/")
                }
            }catch(error){
                console.log(error)
            }

        }
    }


    return (
        <>
            <Header/>
            <div className='flex justify-center items-center h-screen'>
                <div className='w-[400px] h-auto bg-zinc-500 rounded-[10px] p-[20px] pb-[40px] text-center'>
                    <div className='font-bold text-[24px] mt-[20px]'>Вход</div>
                    <div className='max-w-[300px] mx-auto mt-[30px]'>
                        <div>
                            <Input type={'text'} labelText={"Логин"} placeholder={"Логин"} value={data.login} name="login" onChange={handleChange}/>
                            {
                                errors.login && <div className={`${errors.login ? "block" : "hidden"} text-red-400 mt-[-10px] mb-[10px]`}>{errors.login}</div>
                            }
                        </div>
                        <div>
                            <Input type={'password'} labelText={"Пароль"} placeholder={"Пароль"} value={data.password} name="pass" onChange={handleChange}/>
                            {
                                errors.password && <div className={`${errors.password ? "block" : "hidden"} text-red-400 mt-[-10px] mb-[10px]`}>{errors.password}</div>
                            }
                        </div>
                        
                        <div>
                            <Input type={'password'} labelText={"Повтор пароля"} placeholder={"Повтор пароля"} value={data.repeatPassword} name="repeatPass" onChange={handleChange}/>
                            {
                                errors.repeatPassword && <div className={`${errors.repeatPassword ? "block" : "hidden"} text-red-400 mt-[-10px] mb-[10px]`}>{errors.repeatPassword}</div>
                            }
                        </div>
                        <button className={'bg-black w-full h-[40px] rounded-[15px] uppercase font-bold hover:border hover:border-white'} onClick={register}>Зарегистрироваться</button>
                        <div className='mt-[15px]'>Есть аккаунт? <Link to={'/login'} className='hover:text-gray-400'>Войти</Link></div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default Register;
