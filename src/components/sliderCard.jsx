

export default function SliderCard({imageUrl, text}){
    return(
        <div className="flex gap-[15px]">
          <div className="flex justify-center items-center gap-[25px]">
            <img
              src={imageUrl}
              alt="sdf"
              className="rounded-[10px] h-[350px] w-[500px]"
            >
            </img>
            <div className="bg-black opacity-45 relative z-10 w-[500px] h-[150px] p-[10px] rounded-xl">
              <div className="absolute z-20 text-white leading-5">
                {text}
              </div>
            </div>  
          </div>
        </div>
    )
}