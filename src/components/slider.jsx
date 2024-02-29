import React, { useEffect, useState } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import SliderCard from "./sliderCard";

import { doc, getDoc } from "firebase/firestore"; 
import firestore from "../firebase";


export default function SimpleSlider() {
  const [sliderData, setSliderData] = useState()

  useEffect(() =>{
    const fetchData = async () => {
      const data = doc(firestore, "slider", "sliderData")
      const docSnap = await getDoc(data);
      setSliderData(docSnap.data())
    }
    fetchData()
  },[])

  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <>
    {
      sliderData &&
      <Slider {...settings} className="pb-[20px]">
        {Object.entries(sliderData.Content).map(([key, slide]) =>{

          // const imageRef = ref(storage, `sliderImage/${slide.image}`)

          // getDownloadURL(imageRef).then((url)={
          //   setImageUrl(url)
          // }).catch((error) => {
          //   console.error('Error getting download URL:', error);
          // });

          return(
            <SliderCard key={key} imageUrl = {slide.image} text={slide.text}/>
          )
        })}
      </Slider>
      
    }
    </>
  );
}