import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { ref, deleteObject, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: 0,
  borderRadius: '10px',
  outline: 'none',
  p: 4,
};

export default function ModalAdminChangeHotel({modalOpen, modalClose, hotel, imageUrlCard}) {
  // Открытиек закрытие окна
  const [open, setOpen] = React.useState(modalOpen);
  React.useEffect(() => {
    if(modalOpen){
        setOpen(false)
    }else{
        setOpen(true)
    }
  },[modalOpen])


  const [imageUrl, setImageUrl] = React.useState(imageUrlCard)
  const [extension, setExtension] = React.useState("")

  const [image, setImage] = React.useState()

  const [addHotelData, setAddHotelData] = React.useState({
      hotel_name: hotel.hotel_name,
      address: hotel.address,
      price: hotel.price,
      rooms_count: hotel.rooms_count,
      bar: hotel.bar,
      kids: hotel.kids,
      kitchen: hotel.kitchen,
      park: hotel.park,
      pets: hotel.pets,
      trans: hotel.trans,
      wifi: hotel.wifi,
  })

  // Событие при изменении всех полей
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


  // При загрузке фото
  const fileReader = (event) => {
    const file = event.target.files[0];
      if (file) {
        const extension = file.name.split('.').pop();
        const allowedExtensions = ['jpeg', 'jpg', 'png']; // Разрешенные расширения

        if (allowedExtensions.includes(extension.toLowerCase())) {

          // Сохранения расширения
          setExtension(extension)
          setImage(file)

          const reader = new FileReader();
    
          // Установка фото в img
          reader.onload = function (e) {
            const imageUrl = e.target.result;
            setImageUrl(imageUrl);
          };
    
          reader.readAsDataURL(file);
        } else {
          alert('Пожалуйста, выберите изображение с расширением jpeg, jpg или png.');
        }
      }
  };

  // Изменение отеля
  const confrimChanges = async () =>{
  // Проверки перед отправкой данных
    if (!addHotelData.hotel_name || !addHotelData.address || addHotelData.price <= 0 || addHotelData.roomsCount <= 0) {
      alert("Поля не могут быть пустыми");
      return;
    }

    // Проверка, что хотя бы один чекбокс выбран
    if (!addHotelData.bar && !addHotelData.kids && !addHotelData.kitchen && !addHotelData.park && !addHotelData.pets && !addHotelData.trans && !addHotelData.wifi) {
      alert("Пожалуйста, выберите хотя бы один сервис.");
      return;
    }



    try{
      if(image){
        const fileRef = ref(storage, hotel.image_url)
        await deleteObject(fileRef);
        await uploadBytes(ref(storage, hotel.image_url.split(".")[0]  + "." + extension), image);
      }else{
        console.log("Фото не было изменено")
      }

      const response = await fetch(`http://localhost:3000/update/${hotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addHotelData),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload()
      } else {
        console.error('Ошибка при обновлении отеля:', data.message || 'Внутренняя ошибка сервера');
      }
  

    }catch{
      console.log("Ошибочка вышла при изменении данных")
    }

  }



  return (
    <div>
      <Modal
        open={open}
        onClose={modalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <div className='bg-gray-400 w-full h-full rounded-[10px] p-[20px]'>
                <div className='text-white font-bold text-[18px] mb-[30px]'>Изменение параметров отеля</div>
                <div className='flex justify-between gap-4 h-full'>
                    {/* Картинка */}
                    <div className='h-full w-full'>
                        <img src={imageUrl} alt="Фото отеля" className='block w-full h-full max-w-[370px] max-h-[210px] rounded-[10px]'/>
                        <input type="file" onChange={fileReader} className='block mt-[20px]'/>
                    </div>
                    {/* Поля ввода */}
                    <div>
                        <div className='mb-[10px]'>
                            <div>Название</div>
                            <input type="text"
                                name="hotel_name"
                                value={addHotelData.hotel_name}
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
                                name="rooms_count"
                                value={addHotelData.rooms_count}
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
                            <span>Кухня</span>
                            <input
                                type="checkbox"
                                name="kitchen"
                                checked={addHotelData.kitchen}
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
                <div className='flex justify-around gap-[20px]'>
                  <div className='flex bg-black justify-center mx-auto py-[10px] rounded-lg w-full max-w-[400px] mt-[30px] cursor-pointer hover:drop-shadow-lg' onClick={confrimChanges}>Изменить</div>
                  <div className='flex bg-black justify-center mx-auto py-[10px] rounded-lg w-full max-w-[400px] mt-[30px] cursor-pointer hover:drop-shadow-lg' onClick={modalClose}>Отмена</div>
                </div>
            </div>
        </Box>
      </Modal>
    </div>
  );
}