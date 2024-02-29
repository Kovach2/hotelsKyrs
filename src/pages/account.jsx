import React, { useEffect, useState } from 'react';
import Container from '../components/container';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reserve, liked } from '../redux/accountSlice';


import { ref, getDownloadURL} from 'firebase/storage';
import {storage} from '../firebase';

import HotelCard from '../components/hotelCard';

const Account = () => {
    const reserv = useSelector((state) => state.account.reserv)
    const like = useSelector((state) => state.account.liked)
    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch()

    const [likeHotels, setLikeHotels] = useState([])
    const [likeHotelsCards, setLikeHotelsCards] = useState([])
    const [imageUrls, setImageUrls] = useState();

    const [reservHotelsNames , setReservHotelsNames] = useState([])
    const [reservData, setReservData] = useState([])

    useEffect(() => {
        const fetchData = async() =>{
            const response = await fetch("http://localhost:3000/likeHotel", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: user.username})
            })

            const data = await response.json()

            setLikeHotels(data.status)
        }

        fetchData()
    }, []);

    useEffect(() =>{
        const fetchData = async () =>{
            const response = await fetch("http://localhost:3000/hotel/account-reserv", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: user.username})
            })

            const data = await response.json()

            setReservData(data.reservData)

            const hotelIds = data.reservData.map(obj => obj.hotel_id)
            const hotelNamesPromises = hotelIds.map(id => getHotelName(id))
            const uniqueHotelNames = await Promise.all(hotelNamesPromises)

            setReservHotelsNames([...uniqueHotelNames]);
        }
        fetchData()
    },[])

    const getHotelName = async (id) =>{
        const responseHotels = await fetch(`http://localhost:3000/hotels/id?hotel_id=${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await responseHotels.json()

        const hotelName = data.hotels[0].hotel_name

        return hotelName
    }


    useEffect(()=>{
        const fetchData = async() =>{
            const hotelIdString = likeHotels.map(item => item.hotel_id.toString()).join(',');

            const response = await fetch(`http://localhost:3000/hotels/id?hotel_id=${hotelIdString}`, {
                method: "GET",
            })

            const data = await response.json()
            setLikeHotelsCards(data.hotels)
        }
        likeHotels &&
            fetchData()
    },[likeHotels])


    
    useEffect(()=>{
        const loadImages = async () => {
            const updatedImageUrls = {};
            if(likeHotelsCards){
                for (const [key, hotel] of Object.entries(likeHotelsCards)) {
                    const imageRef = ref(storage, hotel.image_url);
                    try {
                        const url = await getDownloadURL(imageRef);
                        updatedImageUrls[key] = url;
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                    }
                }
                setImageUrls(updatedImageUrls);
            }else{
                console.log("Карточек нет")
            }
        };

        loadImages()
    },[likeHotelsCards])

    return (
        <>
            <Header/>
            <Container>
            <div className='pt-[100px] flex gap-[70px]'>
                <div className='text-black w-full max-w-[250px] h-full bg-gray-400 flex flex-col gap-[15px] p-[20px] rounded-[10px]'>
                    <div className={`${reserv ? "text-black" : "text-white hover:text-black cursor-pointer"}`} onClick={() => {dispatch(reserve())}}>Мои бронирования</div>
                    <div className={`${like ? "text-black" : "text-white hover:text-black cursor-pointer"}`}  onClick={() => {dispatch(liked())}}>Мои избранные отели</div>
                </div>
                {
                    reserv &&

                    <div className='bg-gray-400 w-full h-full rounded-[10px] p-[20px]'>
                        <div className='text-white font-bold text-[18px] mb-[30px]'>Мои бронирования</div>
                        {
                            reservData.length > 0 ?
                            <div className='mt-[-15px]'>
                                <div className='flex mb-[10px]'>
                                    <div className='w-1/4 font-medium uppercase text-center'>Название отеля</div>
                                    <div className='w-1/4 font-medium uppercase text-center'>Кол-во человек</div>
                                    <div className='w-1/4 font-medium uppercase text-center'>Кол-во комнат</div>
                                    <div className='w-1/4 font-medium uppercase text-center'>Цена</div>
                                </div>
                                <div className='flex flex-col gap-[20px]'>
                                    {
                                        reservData.map((hotel,index) =>{
                                            return(
                                                <div key={index} style={{overflowWrap: "anywhere"}} className='flex border border-black py-[10px] rounded'>
                                                    <div className='w-1/4 text-center'>{reservHotelsNames[index]}</div>
                                                    <div className='w-1/4 text-center'>{hotel.count_persons}</div>
                                                    <div className='w-1/4 text-center'>{Math.ceil(hotel.count_persons / 2)}</div>
                                                    <div className='w-1/4 text-center'>{hotel.reserv_price} BYN</div>
                                                </div>

                                            )
                                        })
                                    }
                                </div>
                            </div>
                            :
                            <>
                                <div className='text-[16px] mb-[20px]'>У вас пока нет бронирований<br/>Самое время начать планировать отпуск!</div>
                                <Link to={"/"} className='bg-black max-w-[300px] text-center block px-[10px] py-[15px] rounded-[10px] mx-auto'>Прейти на страницу с отелями</Link>
                            </>
                        }
                       
                    </div>
                }
                {
                    like && (
                        <div className='bg-gray-400 w-full h-full rounded-[10px] p-[20px]'>
                            <div className='text-white font-bold text-[18px] mb-[30px] w-full'>Ваша подборка избранных отелей</div>
                            {likeHotelsCards.length > 0 ? 
                                <div className='w-full flex flex-col gap-[20px]'>
                                    {likeHotelsCards.map((card, index) =>{
                                        return( 
                                            <HotelCard key={index} hotel={card} imageUrls={imageUrls} index={index} accountCard={true}/>
                                        )
                                    })} 
                                </div>
                             : 
                                <div className='text-[16px] mb-[20px]'>У вас пока нет избранных отелей. Начните отмечать «сердечком» понравившиеся отели, и они появятся здесь.<br/><br/>Сохраняйте отели, чтобы вернуться к ним в будущем или поделиться ими с друзьями.</div>
                            }
                        </div>
                    )
                }
            </div>
            </Container>
        </>
       

    );
}

export default Account;
