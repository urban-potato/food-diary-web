import { FC } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import {
  BREAKFAST_DEFAULT_ID,
  DINNER_DEFAULT_ID,
  LUNCH_DEFAULT_ID,
} from "../constants/constants";
import { MealTypeOptionsProps } from "../types/types";

const MealTypeOptions: FC<MealTypeOptionsProps> = ({
  selectedMealType,
  setSelectedMealType,
}) => {
  return (
    <div className="h-full w-full flex flex-wrap justify-center items-center py-3 gap-x-5 gap-y-2">
      <span className="w-full sm:w-[30%]">
        <ButtonIlluminated
          label={"Завтрак"}
          isDarkButton={selectedMealType == BREAKFAST_DEFAULT_ID ? true : false}
          isIlluminationFull={
            selectedMealType == BREAKFAST_DEFAULT_ID ? true : false
          }
          onClick={() => setSelectedMealType(BREAKFAST_DEFAULT_ID)}
          buttonPadding=" p-[14px] "
        />
      </span>
      <span className="w-full sm:w-[30%]">
        <ButtonIlluminated
          label={"Обед"}
          isDarkButton={selectedMealType == LUNCH_DEFAULT_ID ? true : false}
          isIlluminationFull={
            selectedMealType == LUNCH_DEFAULT_ID ? true : false
          }
          onClick={() => setSelectedMealType(LUNCH_DEFAULT_ID)}
          buttonPadding=" p-[14px] "
        />
      </span>
      <span className="w-full sm:w-[30%]">
        <ButtonIlluminated
          label={"Ужин"}
          isDarkButton={selectedMealType == DINNER_DEFAULT_ID ? true : false}
          isIlluminationFull={
            selectedMealType == DINNER_DEFAULT_ID ? true : false
          }
          onClick={() => setSelectedMealType(DINNER_DEFAULT_ID)}
          buttonPadding=" p-[14px] "
        />
      </span>
    </div>
  );
};

export default MealTypeOptions;
