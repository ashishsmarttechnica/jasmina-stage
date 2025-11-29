function Card({ children, className = "", onClick }) {
  return (
    <div
      className={`font-Ubuntu shadow-card flex w-full flex-col rounded-md border border-black/10 bg-white text-black sm:w-[285px] md:w-[266px] xl:w-[280px] ${className} `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Card;
