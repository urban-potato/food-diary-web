import { Controller } from "react-hook-form";
import Select from "react-select";
import { DECIMAL_REGEX, SELECT_STYLES } from "../../global/constants/constants";
import ButtonIlluminated from "../../ui/ButtonIlluminated/ButtonIlluminated";
import { ChangeEvent, FC, useRef } from "react";
import { Player } from "@lordicon/react";
import DELETE_ICON from "../../global/assets/trash.json";
import InputIlluminated from "../../ui/InputIlluminated/InputIlluminated";
import { replaceIncorrectDecimal } from "../../global/helpers/replace-incorrect-decimal.helper";
import Errors from "../../ui/Errors/Errors";

type TProps = {
  itemId: any;
  itemIndex: any;
  label: any;
  selectPlaceholder: any;
  handleRemoveItem: any;
  controllerName: any;
  control: any;
  register: any;
  isDeleteButtonDisabled?: boolean;
  hasErrors: boolean;
  errorMessagesList: Array<string>;
};

const DisabledSelectRowWithWeightField: FC<TProps> = ({
  itemId,
  itemIndex,
  label,
  selectPlaceholder,
  handleRemoveItem,
  controllerName,
  control,
  register,
  isDeleteButtonDisabled = false,
  hasErrors,
  errorMessagesList,
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
              <Select
                {...field}
                className="relative text-sm rounded-xl"
                styles={SELECT_STYLES}
                isDisabled={true}
                placeholder={selectPlaceholder}
              />
            )}
          />
        </div>

        <div className="sm:max-w-[100px] max-w-[80px] flex-grow">
          <InputIlluminated
            id={`InputIlluminated_${itemId}_${itemIndex}`}
            type="text"
            inputLabel="Вес (г)"
            register={{ ...register }}
            isRequired={true}
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              const isValidInput = DECIMAL_REGEX.test(event.target.value);

              if (!isValidInput) {
                event.target.value = replaceIncorrectDecimal(
                  event.target.value
                );
              }
            }}
            className="h-[67px]"
          />
        </div>

        <div className="max-w-[50px] flex flex-col justify-center items-center self-center">
          <h3 className="text-lg my-4"> </h3>
          <ButtonIlluminated
            children={
              <span>
                <Player
                  ref={deleteIconPlayerRef}
                  icon={DELETE_ICON}
                  size={ICON_SIZE}
                  colorize="#f8f7f4"
                />
              </span>
            }
            type="button"
            onClick={() => {
              handleRemoveItem(itemIndex);
            }}
            isDisabled={isDeleteButtonDisabled}
            className="p-[12px]"
          />
        </div>
      </div>

      {hasErrors && <Errors errorMessagesList={errorMessagesList} />}
    </div>
  );
};

export default DisabledSelectRowWithWeightField;
