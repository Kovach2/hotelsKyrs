import React, { useState } from 'react';
import ModalAdminChangeHotel from '../modalAdminChangeHotel';


const ChangeHotelCard = ({hotel, imageUrl}) => {
    const [modalOpen, setModalOpen] = useState(true)
    return (
        <div className='border rounded-[10px] border-black p-[10px] flex gap-3 mb-[10px] last:mb-0'>
            <div className='max-w-[370px] w-full'>
                {
                    imageUrl ?
                    <img src={imageUrl} alt="Картинка отеля" className='rounded-[10px] mb-3 block w-[370px] h-[210px]'/>
                    :
                    <div>Нет картинки</div>
                }
                
                <button className='w-[200px] flex justify-center mx-auto px-[15px] py-[10px] rounded-lg bg-black hover:text-gray-400' onClick={() => {setModalOpen(!modalOpen)}}>Изменить</button>
                {
                    imageUrl &&
                    <ModalAdminChangeHotel modalOpen={modalOpen} modalClose={() => {setModalOpen(!modalOpen)}} hotel={hotel} imageUrlCard={imageUrl}/>
                }
                
            </div>
            <div >
                <div className='text-[16px] mb-[20px]'>{hotel.hotel_name}</div>
                <div className='text-[14px] mb-[20px]'>Кол-во комнат: {hotel.rooms_count}</div>
                <div className='text-[14px] mb-[20px]'>Кол-во свободных комнат: {hotel.rooms_count - hotel.occupied_rooms}</div>
                <div className='text-[14px] mb-[20px]'>Кол-во занятых комнат: {hotel.occupied_rooms}</div>
                <div className='text-[14px] mb-[20px]'>Адрес: {hotel.address}</div>
                <div className='text-[14px]'>Услуги: 
                {hotel.bar && "' Бар и ресторан' "}
                {hotel.kids && "' Можно с детьми' "}
                {hotel.kitchen && "'Кухня' "}
                {hotel.park && "' Парковка' "}
                {hotel.pets && "' Можно с животными' "}
                {hotel.trans && "' Трансфер' "}
                {hotel.wifi && "' Wifi' "}</div>
            </div>
        </div>
    );
}

export default ChangeHotelCard;
