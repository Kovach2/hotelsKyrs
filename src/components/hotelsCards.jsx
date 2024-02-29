import React, { useEffect, useState } from 'react';
import { storage } from '../firebase';

import { ref, getDownloadURL} from 'firebase/storage';
import HotelCard from './hotelCard';

const HotelsCards = () => {

    const [hotels, setHotels] = useState([]);
    const [imageUrls, setImageUrls] = useState({});

    


    useEffect(() => {
      const fetchData = async () => {

        try {
          const response = await fetch('http://localhost:3000/');
          const data = await response.json();
  
          if (response.ok) {
            setHotels(data.hotels);
          } else {
            console.error('Ошибка при получении данных:', data.message || 'Внутренняя ошибка сервера');
          }
        } catch (error) {
          console.error('Ошибка при выполнении запроса:', error.message || error);
        }
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      const loadImages = async () => {
          if (!hotels) {
            return;
          }
        
          const updatedImageUrls = {};
        
          for (const [key, hotel] of Object.entries(hotels)) {
            const imageRef = ref(storage, hotel.image_url);
        
            try {
              const url = await getDownloadURL(imageRef);
              updatedImageUrls[key] = url;
            } catch (error) {
              console.error('Error getting download URL:', error);
            }
          }
        
          setImageUrls(updatedImageUrls);
        };
  
      loadImages();
    }, [hotels]); 

        return (

            hotels.length > 0 ?
            hotels.map((hotel, index) => (
              <HotelCard imageUrls={imageUrls} key={index} hotel={hotel} index={index}/>
              ))
              :
            <div className='text-black text-[60px] text-center'>Отелей в базе нет ;)</div>
        );
        
        
}

export default HotelsCards;
