import React from 'react';

const Input = ({ type = "text", labelText = "text", placeholder = "text", ...props}) => {
    return (
        <>
            <div className='text-start mb-[5px]'>{labelText}</div>
            <input type={type} placeholder={placeholder} className={`outline-none rounded-[10px] h-[40px] w-full px-[20px] text-black mb-[20px]`}  {...props} />
        </>

    );
}

export default Input;
