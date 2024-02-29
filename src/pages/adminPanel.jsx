import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Container from '../components/container';
import ChangeHotelCard from '../components/adminPanel/changeHotelCard';

import generateRandomString from '../components/functions/generateRandomString';

import { useSelector } from 'react-redux';

// import { getDocs, collection, addDoc, updateDoc, doc } from "firebase/firestore"; 
import { ref, getDownloadURL, uploadBytes} from 'firebase/storage';
import { storage } from "../firebase";


const AdminPanel = () => {

    const user = useSelector((state) => state.auth.user)

    const [active, setActive] = useState({hotels: true, addHotel: false, reservs: false})

    const [hotels, setHotels] = useState([]);


    const [reservs, setReservs] = useState([])
    const [reservHotelsNames , setReservHotelsNames] = useState([])


    const [extension, setExtension] = useState()
    const [addHotelData, setAddHotelData] = useState({
        name: "",
        address: "",
        price: 0,
        roomsCount: 0,
        bar: false,
        kids: false,
        kitchen: false,
        park: false,
        pets: false,
        trans: false,
        wifi: false
    })
    const [downloadImageUrl, setDowloadImageUrl] = useState("")

    const [imageUrls, setImageUrls] = useState({});
    const [status, setStatus] = useState('');

    // Получение данных отлей
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

          const responseReservs = await fetch('http://localhost:3000/hotel/admin/account-reserv');
          const dataReservs = await responseReservs.json();
    
          if (responseReservs.ok) {
            setReservs(dataReservs.result);
          } else {
            console.error('Ошибка при получении данных:', dataReservs.message || 'Внутренняя ошибка сервера');
          }

        

        } catch (error) {
          console.error('Ошибка при выполнении запроса:', error.message || error);
        }
      };
  
      fetchData();
    }, []);

    useEffect(()=>{
      const getNames = async () =>{
        const hotelIds = reservs.map(obj => obj.hotel_id)
        const hotelNamesPromises = hotelIds.map(id => getHotelName(id))
        const uniqueHotelNames = await Promise.all(hotelNamesPromises)
  
        setReservHotelsNames([...uniqueHotelNames]);
      }
      getNames()

    },[reservs])

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

    const fileReader = (event) => {
        const file = event.target.files[0];
      
        if (file) {
          const extension = file.name.split('.').pop();
          const allowedExtensions = ['jpeg', 'jpg', 'png']; // Разрешенные расширения

          if (allowedExtensions.includes(extension.toLowerCase())) {

            setExtension(extension)

            const reader = new FileReader();
      
            reader.onload = function (e) {
              const imageUrl = e.target.result;
              setDowloadImageUrl(imageUrl);
            };
      
            reader.readAsDataURL(file);
          } else {
            alert('Пожалуйста, выберите изображение с расширением jpeg, jpg или png.');
          }
        }
    };


    
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


    // Добавление отеля
    const addHotelToFirestore = async () => {
      // Проверки перед отправкой данных
      if (!addHotelData.name || !addHotelData.address || addHotelData.price <= 0 || addHotelData.roomsCount <= 0 || !downloadImageUrl) {
        alert("Пожалуйста, заполните все обязательные поля и выберите картинку.");
        return;
      }
  
      // Проверка, что хотя бы один чекбокс выбран
      if (!addHotelData.bar && !addHotelData.kids && !addHotelData.kitchen && !addHotelData.park && !addHotelData.pets && !addHotelData.trans && !addHotelData.wifi) {
        alert("Пожалуйста, выберите хотя бы один сервис.");
        return;
      }

      try {

        const imageName = generateRandomString()

        const imageUrl = `/hotelsImages/${imageName}.${extension}`;

        const response = await fetch('http://localhost:3000/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hotel_name: addHotelData.name,
            address: addHotelData.address,
            image_url: imageUrl,
            price: addHotelData.price,
            rooms_count: addHotelData.roomsCount,
            occupied_rooms: 0,
            bar: addHotelData.bar,
            kitchen: addHotelData.kitchen,
            kids: addHotelData.kids,
            park: addHotelData.park,
            pets: addHotelData.pets,
            trans: addHotelData.trans,
            wifi: addHotelData.wifi,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setStatus(data.status);
          setAddHotelData({
            name: "",
            address: "",
            price: 0,
            roomsCount: 0,
            bar: false,
            kids: false,
            kitchen: false,
            park: false,
            pets: false,
            trans: false,
            wifi: false,
          });

          const file = document.querySelector('input[type="file"]').files[0];
          const storageRef = ref(storage, imageUrl);
          await uploadBytes(storageRef, file);

          setDowloadImageUrl("");

          alert(`Отель успешно добавлен! ${status}`);
          window.location.reload()

        } else {
          console.error('Ошибка при добавлении отеля:', data.message || 'Внутренняя ошибка сервера');
        }
      } catch (error) {
        console.error('Ошибка при выполнении запроса:', error.message || error);
      }
    };

    // Запись данных
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
      
        // Проверка для полей типа 'number' на отрицательные значения
        const sanitizedValue = type === 'number' ? Math.max(0, +value) : value;
      
        // Для поля 'price' проверяем, чтобы вводились только цифры
        const numericValue = type === 'text' && name === 'price' ? value.replace(/\D/g, '') : sanitizedValue;
      
        setAddHotelData((prevData) => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : numericValue
        }));
    };


    const delReserv = async (id,username) => {
      const response = await fetch(`http://localhost:3000/hotel/admin/reserv-del`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({hotel_id: id, username: username})
        })

      if(response.ok){
        console.log(await response.json())
        window.location.reload()
      }

    }

    return (
        <>
            <Header/>
            <Container>
            <div className='pt-[100px] flex gap-[70px]'>
                <div className='text-black w-full max-w-[250px] h-full bg-gray-400 flex flex-col gap-[15px] p-[20px] rounded-[10px]'>
                    <div className={`${active.hotels ? "text-black" : "text-white hover:text-black cursor-pointer"}`} onClick={() => {setActive({hotels: true, addHotel: false, reservs: false })}}>Отели</div>
                    <div className={`${active.addHotel ? "text-black" : "text-white hover:text-black cursor-pointer"}`} onClick={() => {setActive({hotels: false, addHotel: true, reservs: false })}} >Добавить отель</div>
                    <div className={`${active.reservs ? "text-black" : "text-white hover:text-black cursor-pointer"}`} onClick={() => {setActive({hotels: false, addHotel: false, reservs: true })}} >Бронирование</div>
                </div>
                {   active.hotels &&
                    <div className='bg-gray-400 w-full h-full rounded-[10px] p-[20px]'>
                        <div className='text-white font-bold text-[18px] mb-[15px]'>Отели</div>
                        { hotels && imageUrls ?
                            <>
                              {
                                hotels.length > 0 ?
                                  Object.entries(hotels).map(([key,hotel])=>{
                                    return(
                                        <ChangeHotelCard hotel={hotel} key={key} imageUrl={imageUrls[key]}/>
                                    )
                                  })
                                :
                                <div>Нет добавленных отелей.</div>
                              }
                            </>
                            :
                            <div>Loading...</div>
                        }
                    </div>
                }
                {   active.addHotel &&
                    <div className='bg-gray-400 w-full h-full rounded-[10px] p-[20px]'>
                        <div className='text-white font-bold text-[18px] mb-[30px]'>Добавление отеля</div>
                        <div className='flex justify-between gap-4 h-full'>
                            {/* Картинка */}
                            <div className='h-full w-full'>
                                {
                                    downloadImageUrl ? 
                                    <img src={downloadImageUrl} alt="Фото отеля" className='block w-full h-full rounded-[10px]'/>
                                    :
                                    <div className='min-h-[330px] w-full bg-gray-600 rounded-[10px] font-bold text-[24px] flex items-center justify-center'>
                                        Картинка отеля
                                    </div>
                                }
                                <input type="file" onChange={fileReader} className='block mt-[20px]'/>
                            </div>
                            {/* Поля ввода */}
                            <div>
                                <div className='mb-[10px]'>
                                    <div>Название</div>
                                    <input type="text"
                                        name="name"
                                        value={addHotelData.name}
                                        onChange={handleChange}
                                        className='text-black py-[4px] px-[10px] outline-none rounded-[10px] border border-black'
                                        placeholder='Название'
                                    />
                                </div>
                                <div className='mb-[10px]'>
                                    <div>Адрес</div>
                                    <input
                                        type="text"
                                        name="address"
                                        value={addHotelData.address}
                                        onChange={handleChange}
                                        className='text-black py-[4px] px-[10px] outline-none rounded-[10px] border border-black'
                                        placeholder='Адрес'
                                    />
                                </div>
                                <div className='mb-[10px]'>
                                    <div>Цена - BYN</div>
                                    <input 
                                        type="text" 
                                        name="price"
                                        value={addHotelData.price}
                                        onChange={handleChange}
                                        className='text-black py-[4px] px-[10px] outline-none rounded-[10px] border border-black'
                                    />
                                </div>
                                <div className='mb-[10px] flex justify-between max-w-[220px]'>
                                    <div>Кол-во комнат</div>
                                    <input 
                                        type="number" 
                                        name="roomsCount"
                                        value={addHotelData.roomsCount}
                                        onChange={handleChange}
                                        className='text-black block w-[55px] outline-none rounded-[10px] px-[5px]'
                                    />
                                </div>
                                <div className=' max-w-[220px] flex justify-between'>
                                    <span>Бар и ресторан</span>
                                    <input
                                        type="checkbox"
                                        name="bar"
                                        checked={addHotelData.bar}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div  className=' max-w-[220px] flex justify-between'>
                                    <span>Можно с детьми</span>
                                    <input
                                        type="checkbox"
                                        name="kids"
                                        checked={addHotelData.kids}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div  className=' max-w-[220px] flex justify-between'>
                                    <span>Парковка</span>
                                    <input
                                        type="checkbox"
                                        name="park"
                                        checked={addHotelData.park}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div  className=' max-w-[220px] flex justify-between'>
                                    <span>Можно с животными</span>
                                    <input
                                        type="checkbox"
                                        name="pets"
                                        checked={addHotelData.pets}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div  className=' max-w-[220px] flex justify-between'>
                                    <span>Трансфер</span>
                                    <input
                                        type="checkbox"
                                        name="trans"
                                        checked={addHotelData.trans}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div  className=' max-w-[220px] flex justify-between'>
                                    <span>Wifi</span>
                                    <input
                                        type="checkbox"
                                        name="wifi"
                                        checked={addHotelData.wifi}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div> 
                        </div>
                        <div className='flex bg-black justify-center mx-auto py-[10px] rounded-lg max-w-[400px] mt-[30px] cursor-pointer hover:drop-shadow-lg' onClick={addHotelToFirestore}>Добавить</div>
                    </div>
                }
                {
                  active.reservs &&
                  <div className='bg-gray-400 w-full h-full rounded-[10px] p-[20px]'>
                      <div className='text-white font-bold text-[18px] mb-[15px]'>Бронирования</div>
                     {
                        reservs.length > 0 ?
                        <div className='mt-[15px]'>
                                <div className='flex mb-[10px] w-[85%]'>
                                    <div className='w-1/5 font-medium uppercase text-center text-[10px]'>Имя пользователя</div>
                                    <div className='w-1/5 font-medium uppercase text-center text-[10px]'>Название отеля</div>
                                    <div className='w-1/5 font-medium uppercase text-center text-[10px]'>Кол-во человек</div>
                                    <div className='w-1/5 font-medium uppercase text-center text-[10px]'>Кол-во комнат</div>
                                    <div className='w-1/5 font-medium uppercase text-center text-[10px]'>Цена</div>
                                </div>
                                <div className='flex flex-col gap-[20px]'>
                                    {
                                        reservs.map((hotel,index) =>{
                                            return(
                                              <div className='flex gap-[10px]'>
                                               <div key={index} style={{overflowWrap: "anywhere"}} className='flex border border-black py-[10px] rounded w-[95%]'>
                                                    <div className='w-1/5 text-center'>{hotel.username}</div>
                                                    <div className='w-1/5 text-center'>{reservHotelsNames[index]}</div>
                                                    <div className='w-1/5 text-center'>{hotel.count_persons}</div>
                                                    <div className='w-1/5 text-center'>{Math.ceil(hotel.count_persons / 2)}</div>
                                                    <div className='w-1/5 text-center'>{hotel.reserv_price} BYN</div>
                                                </div>
                                                <div className='flex justify-center items-center bg-red-600 px-[15px] mx-auto rounded hover:bg-red-400 cursor-pointer' onClick={() => delReserv(hotel.hotel_id, hotel.username)}>Удалить</div>
                                              </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        :
                        <div>
                          У пользователей нет бронирований
                        </div>
                     }
                  </div>
                }
            </div>
            </Container>
          
        </>

    );
}

export default AdminPanel;
