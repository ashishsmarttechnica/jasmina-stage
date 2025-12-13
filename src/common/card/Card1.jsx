function Card1({ children, className = "", onClick }) {
    return (
        <div
            className={`font-Ubuntu shadow-card flex w-full max-[713px]:max-w-full max-w-[370px] min-[696px]:max-w-[450px] flex-col rounded-md border border-black/10 bg-white text-black ${className} `}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default Card1;
