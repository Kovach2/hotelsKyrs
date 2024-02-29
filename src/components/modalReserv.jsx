import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useSelector } from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: 0,
  borderRadius: '10px',
  outline: 'none',
  p: 3,
};


export default function ModalReserv({modalOpen, modalClose, hotel, disabled}) {
  const user = useSelector((state) => state.auth.user)


  const [reservData, setReservData] = React.useState({
    username: user.username,
    hotel_id: hotel.id,
    count_persons: 0,
    reserv_price: 0,
    freeRooms: hotel.rooms_count - hotel.occupied_rooms
  })

  const handleChange = (e) => {
    const { value, type } = e.target;
  
    // Проверка для полей типа 'number' на отрицательные значения
    const sanitizedValue = type === 'number' ? Math.max(0, +value) : value;

    // Для поля 'price' проверяем, чтобы вводились только цифры
    let numericValue = sanitizedValue;
    if(value > 100){
      numericValue = 99
    }
    let price

    if(numericValue === 0){
      price = 0
    }else{
      if (numericValue % 2 === 0) {
        price = (numericValue / 2) * hotel.price;
      } else {
        price = ((numericValue + 1) / 2) * hotel.price;
      }
    }
  
    setReservData({
      username: user.username,
      hotel_id: hotel.id,
      count_persons: numericValue,
      reserv_price: price,
      freeRooms: hotel.rooms_count - hotel.occupied_rooms,
      occupied_rooms: hotel.occupied_rooms
    });
  };


  const reserv = async () =>{
    if(reservData.count_persons % 2 !== 0){
      alert("Кол-во человек должно быть четным")
    }else{
      if(reservData.count_persons > 0 && (reservData.count_persons / 2) <= (hotel.rooms_count - hotel.occupied_rooms)){
        const response = await fetch("http://localhost:3000/hotel/reserv",{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservData)
        })
  
        const result = await response.json()
  
        console.log(result)
  
        alert("Отель успешно забронирован")
        window.location.reload();
      }else{
        alert("Ошибка бронирования")
      }
    }
    
  }

  return (
    <div>
      <Modal
        open={!disabled ? false : modalOpen}
        onClose={modalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className='block text-black text-[24px] font-bold w-[250px] h-auto'>{hotel.hotel_name}</h1>
          <span className='block text-black uppercase opacity-60 mb-3'>{hotel.address}</span>
          {
            disabled ?
            <>
              <div className='flex items-center justify-center gap-[10px]'>
              <div className='flex justify-center items-center gap-[5px]'>
                <div className='text-black'>Кол-во человек</div>
                <input 
                  type="number" 
                  name="count_persons"
                  value={reservData.count_persons}
                  onChange={handleChange}
                  className='text-black border border-black block w-[55px] outline-none rounded-[10px] px-[5px]'
                />
              </div>
              <div className='text-black'>Свободных комнат: {hotel.rooms_count - hotel.occupied_rooms}</div>
            </div>

            <div className='text-black text-center my-[25px]'>Цена: {reservData.reserv_price} BYN</div>
            <div className='text-black text-[10px] text-center opacity-75'>Примечание в комнате помещается только два человека!</div>
            <div className={`bg-blue-600 flex items-center justify-center p-[12px] rounded-[10px] cursor-pointer`} onClick={reserv}>Забронировать</div>
            </>
            :
            <div className='text-black text-[20px] text-center font-bold'>В отеле нет мест</div>
        }
        </Box>
      </Modal>
    </div>
  );
}