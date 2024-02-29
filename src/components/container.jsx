export default function Container({children}) {
    return (
      <div className="w-full h-full max-w-[1140px] mx-auto px-[15px]">
        {children}
      </div>
    );
  }
  