export default function Button({ children, onClick, type = "button", color, width, variant}) {

    const classDefault = "relative overflow-hidden  h-10 text-sm rounded-xl font-medium flex items-center justify-center gap-2 px-4 tap-highlight-transparent transition-all duration-150 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary active:scale-95 motion-reduce:transition-none border-2"
    const colorButton = {
        green: {
            background: "bg-green-500",
            text: "text-black",
            ripple: "ripple-green",
            border: "border-green-500",
            borderGhost: "border-green-500",
        },
        gray: {
            background: "bg-button-gray",
            text: "text-white",
            ripple: "ripple-gray",
            border: "border-button-gray",
            textGhost: "button-gray-text",
            borderGhost: "borderGhost-button-gray",
        },
        blue: {
            background: "bg-blue-500",
            text: "text-black",
            ripple: "ripple-blue",
            border: "border-blue-500",
            borderGhost: "border-blue-500",
        },
    };

    const selectedColor = colorButton[color] || colorButton.gray;

    const handleClick = (e) => {
        const button = e.currentTarget;
        const ripple = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        ripple.classList.add("ripple", selectedColor.ripple);
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
        ripple.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;

        const oldRipple = button.querySelector(".ripple");
        if (oldRipple) oldRipple.remove();

        button.appendChild(ripple);

        if (onClick) onClick(e);
    };

    switch (variant) {
        case 'solid':
            return (
                <button
                    onClick={handleClick}
                    type={type}
                    className={`${classDefault} ${selectedColor.border} ${width} ${selectedColor.background} ${selectedColor.text}`}
                >
                    {children}
                </button>
            );

        case 'ghost': 
            return (
                <button
                    onClick={handleClick}
                    type={type}
                    className={`${classDefault} ${width} ${selectedColor.borderGhost} ${selectedColor.textGhost}`}
                >
                    {children}
                </button>
            )

        default: 
            return (
                <button
                    onClick={handleClick}
                    type={type}
                    className={`${classDefault} ${selectedColor.border} ${width} ${selectedColor.background} ${selectedColor.text}`}
                >
                    {children}
                </button>
            );
    }
}



// `relative overflow-hidden ${width} h-10 text-sm rounded-xl font-medium flex items-center justify-center gap-2 px-4 tap-highlight-transparent transition-all duration-150 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary active:scale-95 motion-reduce:transition-none border-2 border-rose-400 ${selectedColor.background} ${selectedColor.text}`