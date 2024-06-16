import { Controller } from "react-hook-form";
import Select from "react-select";
import NoOptionsMessage from "../NoOptionsMessage/NoOptionsMessage";
import { DECIMAL_REGEX, SELECT_STYLES } from "../../global/constants/constants";
import InputIlluminated from "../../ui/InputIlluminated/InputIlluminated";
import ButtonIlluminated from "../../ui/ButtonIlluminated/ButtonIlluminated";
import { Player } from "@lordicon/react";
import DELETE_ICON from "../../global/assets/trash.json";
import { ChangeEvent, FC, useRef, useState } from "react";
import { replaceIncorrectDecimal } from "../../global/helpers/replace-incorrect-decimal.helper";
import Errors from "../../ui/Errors/Errors";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  useClick,
} from "@floating-ui/react";

type TProps = {
  itemId: any;
  itemIndex: any;
  label: any;
  selectPlaceholder: any;
  handleRemoveItem: any;
  controllerName: any;
  control: any;
  register: any;
  handleOnSelectInputChange: any;
  handleOnSelectValueChange: any;
  isDeleteButtonDisabled?: boolean;
  hasErrors: boolean;
  errorMessagesList: Array<string>;
  linkForNoOptionsMessage?: string;
  selectOptions: Array<any>;
};

const SelectRowWithWeightField: FC<TProps> = ({
  itemId,
  itemIndex,
  label,
  selectPlaceholder,
  handleRemoveItem,
  controllerName,
  control,
  register,
  handleOnSelectInputChange,
  handleOnSelectValueChange,
  isDeleteButtonDisabled = false,
  hasErrors,
  errorMessagesList,
  linkForNoOptionsMessage = "",
  selectOptions,
}) => {
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  const selectValueLabelRef = useRef<string>("");

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    // Make sure the tooltip stays on the screen
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
    ],
  });

  // Event listeners to change the open state
  //   const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  // Role props for screen readers
  const role = useRole(context, { role: "tooltip" });

  const click = useClick(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    // hover,
    click,
    focus,
    dismiss,
    role,
  ]);

  return (
    <div className="form-control flex flex-col mb-1">
      <div className="gap-x-3 flex items-end">
        <div className="flex flex-col justify-center gap-1 flex-grow">
          <span className="flex gap-x-1 text-base">
            <h3>{label}</h3>
            <p className="text-red">*</p>
          </span>
          <div ref={refs.setReference} {...getReferenceProps()}>
            <Controller
              name={controllerName}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="relative text-sm rounded-xl"
                  components={{
                    NoOptionsMessage: NoOptionsMessage(linkForNoOptionsMessage),
                  }}
                  styles={SELECT_STYLES}
                  placeholder={selectPlaceholder}
                  onInputChange={handleOnSelectInputChange}
                  onChange={(newValue) => {
                    handleOnSelectValueChange(newValue, itemIndex);
                    field.onChange(newValue);

                    selectValueLabelRef.current = newValue.label;
                  }}
                  maxMenuHeight={150}
                  options={selectOptions}
                />
              )}
            />
            {selectValueLabelRef.current && (
              <FloatingPortal>
                {isOpen && (
                  <div
                    className="max-w-max bg-[#444] text-white text-[90%] px-2 py-1 rounded-lg lg:hidden"
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                  >
                    {selectValueLabelRef.current}
                  </div>
                )}
              </FloatingPortal>
            )}
          </div>
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

export default SelectRowWithWeightField;
