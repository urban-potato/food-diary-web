const illumination = {
  light:
    " absolute " +
    " bg-gradient-to-r from-purple-500 to-purple-500 " +
    " rounded-full " +
    " blur-sm " +
    " opacity-40 " +
    " group-hover/illuminatedButton:opacity-80 " +
    " group-focus/illuminatedButton:opacity-80 " +
    " transition duration-1000 " +
    " group-hover/illuminatedButton:duration-500 ",
  full:
    " absolute " +
    " bg-gradient-to-r from-purple-500 to-purple-500 " +
    " rounded-full " +
    " blur-sm " +
    " opacity-80 ",
  disabled: 
  " absolute " + 
  "  " + 
  " rounded-full " + 
  "  " + 
  "  ",
};

const buttonStyle = {
  light:
    " relative cursor-pointer " +
    " flex-grow flex-shrink " +
    " flex justify-center items-center " +
    " rounded-full " +
    " truncate " +
    " bg-[#fff] " +
    " text-near_black  " +
    " transition duration-1000 " +
    " hover:duration-500 ",
  dark:
    " relative cursor-pointer " +
    " flex-grow flex-shrink " +
    " flex justify-center items-center " +
    " rounded-full " +
    " truncate " +
    " bg-near_black " +
    " text-near_white " +
    " transition duration-1000 " +
    " hover:duration-500 ",
  disabled:
    " relative " +
    " flex-grow flex-shrink " +
    " flex justify-center items-center " +
    " rounded-full " +
    " truncate " +
    " bg-light_near_black " +
    " border-light_near_black " +
    " text-near_white " +
    " transition duration-1000 " +
    " hover:duration-500 ",
};

interface IIlluminatedButtonData {
  label: string;
  isDarkButton: boolean;
  isIlluminationFull?: boolean;
  inset?: string;
  onClick?: any;
  additionalStyles?: string;
  isButton?: boolean;
  type?: string;
  buttonPadding?: string;
  isDisabled?: boolean;
}

const IlluminatedButton = ({
  label,
  isDarkButton,
  isIlluminationFull = false,
  // inset = " inset-[6px] ",
  inset = " -inset-0.5 ",
  onClick = () => {},
  additionalStyles = "",
  isButton = false,
  type = "submit",
  buttonPadding = " p-5 ",
  isDisabled = false,
}: IIlluminatedButtonData) => {
  return (
    <div
      className=" relative group/illuminatedButton flex 
    
    "
    >
      <div
        className={
          isDisabled
            ? illumination.disabled + inset
            : isIlluminationFull
            ? illumination.full + inset
            : illumination.light + inset
        }
      ></div>
      {isButton ? (
        <button
          className={
            isDisabled
              ? buttonStyle.disabled + buttonPadding + additionalStyles
              : isDarkButton
              ? buttonStyle.dark + buttonPadding + additionalStyles
              : buttonStyle.light + buttonPadding + additionalStyles
          }
          type={type}
          disabled={isDisabled}
        >
          {label}
        </button>
      ) : (
        <span
          role="button"
          className={
            isDarkButton
              ? buttonStyle.dark + buttonPadding + additionalStyles
              : buttonStyle.light + buttonPadding + additionalStyles
          }
          onClick={onClick}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default IlluminatedButton;
