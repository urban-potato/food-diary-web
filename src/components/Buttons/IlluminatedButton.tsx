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
    " hover:duration-500 " ,
  dark:
    " relative cursor-pointer " +
    " flex-grow flex-shrink " +
    " flex justify-center items-center " +
    " rounded-full " +
    " truncate " +
    " bg-near_black " +
    " text-[#f8f7f4] " +
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
  type = "undefined",
  buttonPadding = " p-5 ",
}: IIlluminatedButtonData) => {
  return (
    <div className=" relative group/illuminatedButton flex 
    
    ">
      <div
        className={
          isIlluminationFull
            ? illumination.full + inset
            : illumination.light + inset
        }
      ></div>
      {isButton ? (
        <button
          className={
            isDarkButton
              ? buttonStyle.dark + buttonPadding + additionalStyles
              : buttonStyle.light + buttonPadding + additionalStyles
          }
          type={type}
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
