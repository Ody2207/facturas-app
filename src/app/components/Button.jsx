export default function Button({ children, onClick, type = "button", color }) {
    const colorButton = {
        green: {
            background: "bg-green-500",
            text: "text-white",
        },
        gray: {
            background: "bg-gray-500",
            text: "text-white",
        },
        blue: {
            background: "bg-blue-500",
            text: "text-black",
        },
    };

    const selectedColor = colorButton[color] || colorButton.gray; // fallback a verde

    return (
        <button
            onClick={onClick}
            type={type}
            className={`w-full h-10 text-sm rounded-xl ${selectedColor.background} ${selectedColor.text}`}
        >
            {children}
        </button>
    );
}



{/* <button 
        onClick={onClick}
        type={type}
        className="relative inline-flex items-center justify-center px-4 py-2 min-w-[5rem] h-10 text-sm font-medium text-white bg-blue-600 rounded-md shadow-md transition-transform duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95">
            {children}
        </button>  */}