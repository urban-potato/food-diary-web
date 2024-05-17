import { Player } from "@lordicon/react";
import DELETE_ICON from "../../global/assets/system-regular-39-trash.json";
import ButtonIlluminated from "../../ui/ButtonIlluminated/ButtonIlluminated";
import InputIlluminated from "../../ui/InputIlluminated/InputIlluminated";
import { Controller } from "react-hook-form";
import { FC, useRef } from "react";

type TProps = {
  itemId: any;
  itemIndex: any;
  label: any;
  handleRemoveItem: any;
  controllerName: any;
  control: any;
  register: any;
  errors: any;
  errorsGroup: any;
  errorFeild: any;
  isInputFieldDisabled?: boolean;
  isDeleteButtonDisabled?: boolean;
};

const InputFieldRowWithDeleteButton: FC<TProps> = ({
  itemId,
  itemIndex,
  label,
  handleRemoveItem,
  controllerName,
  control,
  register,
  errors,
  errorsGroup,
  errorFeild,
  isInputFieldDisabled = false,
  isDeleteButtonDisabled = false,
}) => {
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <div className="form-control flex flex-col mb-1">
      <div className="gap-x-3 flex items-end">
        <div className="flex flex-col justify-center gap-1 flex-grow">
          <Controller
            name={controllerName}
            control={control}
            render={({ field }) => (
              <InputIlluminated
                {...field}
                ref={null}
                id={`InputIlluminated_${itemId}_${itemIndex}`}
                type="text"
                placeholder={label}
                disableIllumination={true}
                additionalStyles=" h-[67px] border-0 "
                register={{ ...register }}
                isRequired={true}
                isDisabled={isInputFieldDisabled}
              />
            )}
          />
        </div>

        <div className="max-w-[50px] flex flex-col justify-center items-center self-center">
          <h3 className="text-lg my-3"> </h3>
          <ButtonIlluminated
            label={
              <span>
                <Player
                  ref={deleteIconPlayerRef}
                  icon={DELETE_ICON}
                  size={ICON_SIZE}
                  colorize="#f8f7f4"
                />
              </span>
            }
            isDarkButton={true}
            isIlluminationFull={false}
            onClick={() => {
              handleRemoveItem(itemIndex);
            }}
            buttonPadding=" p-[12px] "
            additionalStyles=" "
            isIttuminationDisabled={true}
            isDisabled={isDeleteButtonDisabled}
          />
        </div>
      </div>

      {errorsGroup && (
        <div
          className={
            Object.keys(errors).length > 0 && errorsGroup[itemIndex]
              ? "flex flex-col mt-1 justify-center items-start"
              : "hidden"
          }
        >
          <p className={errorFeild ? "text-pink-500" : "hidden"}>
            {errorFeild?.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default InputFieldRowWithDeleteButton;