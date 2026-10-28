
function Button({name, onClick}) {
    return (
        <>
            <button className="py-3 px-8 bg-[#3186FF] hover:bg-[#3186ffb8] text-white rounded-full font-medium hover:shadow-md cursor-pointer " onClick={onClick}>{name}</button>
        </>
    )
}

export default Button