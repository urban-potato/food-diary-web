import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import NoOptionsMessage from "../NoOptionsMessage/NoOptionsMessage";
import { SELECT_STYLES } from "../../global/constants/constants";
import InputIlluminated from "../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../ui/ButtonIlluminated/ButtonIlluminated";
import { Player } from "@lordicon/react";
import DELETE_ICON from "../../global/assets/system-regular-39-trash.json";
import { FC, useRef } from "react";

type TProps = {
  itemId: any;
  itemIndex: any;
  label: any;
  selectPlaceholder: any;
  handleRemoveItem: any;
  controllerName: any;
  control: any;
  register: any;
  errors: any;
  errorsGroup: any;
  errorSelect: any;
  errorFeild: any;
  loadSelectOptions: any;
  handleOnSelectInputChange: any;
  handleOnSelectValueChange: any;
  isDeleteButtonDisabled?: boolean;
};

const AsyncSelectRowWithWeightField: FC<TProps> = ({
  itemId,
  itemIndex,
  label,
  selectPlaceholder,
  handleRemoveItem,
  controllerName,
  control,
  register,
  errors,
  errorsGroup,
  errorSelect,
  errorFeild,
  loadSelectOptions,
  handleOnSelectInputChange,
  handleOnSelectValueChange,
  isDeleteButtonDisabled = false,
}) => {
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <div className="form-control flex flex-col mb-1">
      <div className="gap-x-3 flex items-end">
        <div className="flex flex-col justify-center gap-1 flex-grow">
          <span className="flex gap-x-1 text-base">
            <h3>{label}</h3>
            <p className="text-red">*</p>
          </span>
          <Controller
            name={controllerName}
            control={control}
            render={({ field }) => (
              <AsyncSelect
                {...field}
                className="relative text-sm rounded-xl"
                components={{ NoOptionsMessage }}
                styles={SELECT_STYLES}
                placeholder={selectPlaceholder}
                loadOptions={loadSelectOptions}
                onInputChange={handleOnSelectInputChange}
                onChange={(newValue) => {
                  handleOnSelectValueChange(newValue, itemIndex);
                  field.onChange(newValue);
                }}
              />
            )}
          />
        </div>

        <div className="sm:max-w-[100px] max-w-[80px] flex-grow">
          <InputIlluminated
            id={`InputIlluminated_${itemId}_${itemIndex}`}
            type="number"
            inputLabel="Вес (г)"
            disableIllumination={true}
            additionalStyles=" h-[67px] border-0 "
            register={{ ...register }}
            isRequired={true}
          />
        </div>

        <div className="max-w-[50px] flex flex-col justify-center items-center self-center">
          <h3 className="text-lg my-4"> </h3>
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
          <p className={errorSelect ? "text-pink-500" : "hidden"}>
            {errorSelect?.message}
          </p>
          <p className={errorFeild ? "text-pink-500" : "hidden"}>
            {errorFeild?.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default AsyncSelectRowWithWeightField;
