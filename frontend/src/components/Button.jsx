import { getButtonSizeClasses } from '../config/mobile';

function BaseButton({ label, isCorrect, isSelected, disabled, isMobile = false }) {
    let bgColor = "bg-[#374151]";
    let hoverColor = "hover:bg-[#4b5563]";
    
    if (disabled) {
        if (isCorrect) {
            bgColor = "bg-green-500";
            hoverColor = "";
        } else if (isSelected) {
            bgColor = "bg-red-500";
            hoverColor = "";
        }
    }
    
    const sizeClass = getButtonSizeClasses(isMobile);
    
    return (
        <button 
            disabled={disabled}
            className={`font-semibold rounded-md uppercase ${sizeClass} ${bgColor} text-[#ffffff] flex items-center justify-center ${hoverColor} active:scale-95 transition-all duration-75 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {label}
        </button>
    );
}

function ButtonShonen({ label = "Shonen", isCorrect, isSelected, disabled, isMobile = false }) {
    return <BaseButton label={label} isCorrect={isCorrect} isSelected={isSelected} disabled={disabled} isMobile={isMobile} />;
}

function ButtonShojo({ label = "Shojo", isCorrect, isSelected, disabled, isMobile = false }) {
    return <BaseButton label={label} isCorrect={isCorrect} isSelected={isSelected} disabled={disabled} isMobile={isMobile} />;
}

function ButtonSeinen({ label = "Seinen", isCorrect, isSelected, disabled, isMobile = false }) {
    return <BaseButton label={label} isCorrect={isCorrect} isSelected={isSelected} disabled={disabled} isMobile={isMobile} />;
}

export { ButtonShonen, ButtonShojo, ButtonSeinen };