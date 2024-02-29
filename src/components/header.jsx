import React from 'react';
import Container from './container'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';

const Header = () => {

    const session = useSelector((state) => state.auth.isAuthenticated)
    const isAdmin = useSelector((state) => state.auth.isAdmin)
    const user = useSelector((state) => state.auth.user)

    const dispatch = useDispatch()

    return (
        <header className='fixed flex h-[70px] w-full bg-gray-600'>
            <Container>
                <div className='flex justify-between items-center h-full'>
                    <Link to="/" className='text-white font-logo text-[48px] pb-[15px]'>DenisKyrs</Link>
                    {
                        session ?
                        <div className='flex items-center h-full gap-[12px]'>
                            <Link to={`${isAdmin ? "/adminPanel" : "/account"}`} className='w-[40px] h-[40px]'>
                                <img src="/accountIcon.png" alt="acountIcon" className='block w-full h-full'/>
                            </Link>
                            <Link to={`${isAdmin ? "/adminPanel" : "/account"}`}>
                                <div className='font-medium'>{user.username}</div>
                            </Link>
                            <div className='ml-[20px] py-[10px] px-[15px] bg-black rounded-[10px] hover:text-gray-400' onClick={() => {dispatch(logout())}}>Выход</div>
                        </div>
                        :
                        <div className='flex items-center h-full gap-[25px]'>
                            <Link to="/login" className='hover:text-gray-400'>Войти</Link>
                            <Link to="/register" className='hover:text-gray-400'>Зарегистрироваться</Link>
                        </div>
                    }
                </div>
            </Container>
        </header>
    );
}

export default Header;
