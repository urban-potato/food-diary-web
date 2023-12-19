export interface ButtonIIlluminatedProps {
  label: string;
  isDarkButton: boolean;
  isIlluminationFull?: boolean;
  inset?: string;
  onClick?: any;
  additionalStyles?: string;
  isButton?: boolean;
  type?: "submit" | "button" | "reset" | undefined;
  buttonPadding?: string;
  isDisabled?: boolean;
}
