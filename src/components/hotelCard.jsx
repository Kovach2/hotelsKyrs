import React, {useState, useEffect} from 'react';

import ModalReserv from './modalReserv';

import { useSelector } from 'react-redux';


const HotelCard = ({imageUrls, hotel, index, accountCard}) => {
    const user = useSelector((state) => state.auth.user)

    const [like, setLike] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const [likedHotels, setLikeHotels] = useState()

    const buttonDisabled = (hotel.rooms_count - hotel.occupied_rooms) !== 0

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
        if(!accountCard){
            fetchData()
        }

    },[]);


    useEffect(()=>{
    likedHotels &&

    likedHotels.forEach(hotelData => {
        console.log(likedHotels)
        if(hotelData.hotel_id === hotel.id){
            setLike(true)
        }
    });
    },[likedHotels])

    const handleLike = async () => {
        const response = await fetch("http://localhost:3000/likeHotel/add",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({hotel_id: hotel.id, username: user.username})
        })
        const data = await response.json()
        if(data.status){
            setLike(true)
        }else{
            setLike(false)
        }
    };

    return (
        <div className={`flex justify-center`}>
            <img src={imageUrls[index]} alt="" className={`w-[30%] ${accountCard ? "w-[45%]" : ""} block rounded-tl-[10px] rounded-bl-[10px]`}/>
            <div className={`w-[25%] ${accountCard ? "w-[40%]" : ""} p-[20px] bg-white border rounded-tr-[10px] rounded-br-[10px]`}>
                <div className='flex justify-center'>
                    <div className='w-full'>
                        <div className='text-black flex justify-between'>
                            {hotel.hotel_name}
                            {
                                user.username !== "admin" ?
                                (
                                    accountCard ? 
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={"fill-black"}>
                                        <g id="icon24 / heart disable">
                                            <path id="Vector" d="M20.8401 4.61C20.3294 4.099 19.7229 3.69364 19.0555 3.41708C18.388 3.14052 17.6726 2.99817 16.9501 2.99817C16.2276 2.99817 15.5122 3.14052 14.8448 3.41708C14.1773 3.69364 13.5709 4.099 13.0601 4.61L12.0001 5.67L10.9401 4.61C9.90843 3.57831 8.50915 2.99871 7.05012 2.99871C5.59109 2.99871 4.19181 3.57831 3.16012 4.61C2.12843 5.64169 1.54883 7.04097 1.54883 8.5C1.54883 9.95903 2.12843 11.3583 3.16012 12.39L4.22012 13.45L12.0001 21.23L19.7801 13.45L20.8401 12.39C21.3511 11.8792 21.7565 11.2728 22.033 10.6054C22.3096 9.93789 22.4519 9.22249 22.4519 8.5C22.4519 7.77751 22.3096 7.0621 22.033 6.39464C21.7565 5.72718 21.3511 5.12075 20.8401 4.61V4.61Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </g>
                                    </svg>
                                    :
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => handleLike()} className={`${like ? "fill-black" : "hover:fill-black"} cursor-pointer`}>
                                        <g id="icon24 / heart disable">
                                            <path id="Vector" d="M20.8401 4.61C20.3294 4.099 19.7229 3.69364 19.0555 3.41708C18.388 3.14052 17.6726 2.99817 16.9501 2.99817C16.2276 2.99817 15.5122 3.14052 14.8448 3.41708C14.1773 3.69364 13.5709 4.099 13.0601 4.61L12.0001 5.67L10.9401 4.61C9.90843 3.57831 8.50915 2.99871 7.05012 2.99871C5.59109 2.99871 4.19181 3.57831 3.16012 4.61C2.12843 5.64169 1.54883 7.04097 1.54883 8.5C1.54883 9.95903 2.12843 11.3583 3.16012 12.39L4.22012 13.45L12.0001 21.23L19.7801 13.45L20.8401 12.39C21.3511 11.8792 21.7565 11.2728 22.033 10.6054C22.3096 9.93789 22.4519 9.22249 22.4519 8.5C22.4519 7.77751 22.3096 7.0621 22.033 6.39464C21.7565 5.72718 21.3511 5.12075 20.8401 4.61V4.61Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </g>
                                    </svg>
                                )
                                    
                                :
                                <></>
                            }
                            
                        </div>
                        <div className='text-black text-[10px] mt-[4px]'>{hotel.address}</div>
                        <div className='flex gap-[10px] mt-[15px]'>
                            {
                                hotel.wifi &&
                                <div style={{backgroundImage: 'url("https://f.worldota.net/hotel-frontend/branch/b495186/_next/static/assets/internet.9a66602d.svg")'}} className='w-[24px] h-[24px] bg-contain bg-no-repeat'/>
                            }
                            {
                                hotel.trans &&
                                <div style={{backgroundImage: 'url("https://f.worldota.net/hotel-frontend/branch/b495186/_next/static/assets/shuttle.03c96b77.svg")'}} className='w-[24px] h-[24px] bg-contain bg-no-repeat'/>
                            }
                            {
                                hotel.park &&
                                <div style={{backgroundImage: 'url("https://f.worldota.net/hotel-frontend/branch/b495186/_next/static/assets/parking.68e5353e.svg")'}} className='w-[24px] h-[24px] bg-contain bg-no-repeat'/>
                            }
                            {
                                hotel.kids &&
                                <div style={{backgroundImage: 'url("https://f.worldota.net/hotel-frontend/branch/b495186/_next/static/assets/kids.d1d50550.svg")'}} className='w-[24px] h-[24px] bg-contain bg-no-repeat'/>
                            }
                            {
                                hotel.pets && 
                                <div style={{backgroundImage: 'url("https://f.worldota.net/hotel-frontend/branch/b495186/_next/static/assets/pets.4bb162fa.svg")'}} className='w-[24px] h-[24px] bg-contain bg-no-repeat'/>
                            }
                            {
                                hotel.kitchen && 
                                <div style={{backgroundImage: 'url("https://st.worldota.net/master/f02bdfb-226a267/img/svg/amenitiesroom/kitchen.svg")'}} className='w-[24px] h-[24px] bg-contain bg-no-repeat'/>
                            }
                            {
                                hotel.bar && 
                                <div style={{backgroundImage: 'url("https://st.worldota.net/master/f02bdfb-226a267/img/svg/amenitiesmulti/meal.svg")'}} className='w-[24px] h-[24px] bg-contain bg-no-repeat bg-center'/>
                            }
                        </div>
                        <div className='text-black text-[24px] uppercase mt-[20px] text-center'>
                            {hotel.price} byn
                            <span className='block text-[10px] mt-[5px] text-black'>Цена за ночь для 2 гостей</span>
                        </div>
                        {
                            user.username !== "admin" ?
                            <>
                                <div className={`${!buttonDisabled ? "bg-gray-500 text-gray-950 cursor-default" : "bg-blue-600"}  flex items-center justify-center p-[12px] rounded-[10px] mt-[25px] cursor-pointer`}   onClick={() => {setOpenModal(true)}}>Забронировать</div>
                                <ModalReserv hotel={hotel} modalOpen={openModal} modalClose={() => setOpenModal(false)} disabled={buttonDisabled}/>
                            </>
                            :
                            <div className='mt-2'>
                                <div className='text-black text-center'>
                                    Всего комнат: {hotel.rooms_count}
                                </div>
                                <div className='text-black text-center mt-2'>
                                    Занято комнат: {hotel.occupied_rooms}
                                </div>
                                <div className='text-black text-center mt-2'>
                                    Свободных комнат: {hotel.rooms_count - hotel.occupied_rooms}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelCard;
