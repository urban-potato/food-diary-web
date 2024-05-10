import { FC } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import {
  BREAKFAST_DEFAULT_ID,
  DINNER_DEFAULT_ID,
  LUNCH_DEFAULT_ID,
} from "../constants/constants";

type TProps = {
  selectedMealTypeId: string;
  setSelectedMealTypeId: React.Dispatch<React.SetStateAction<string>>;
};

const MealTypeOptions: FC<TProps> = ({
  selectedMealTypeId,
  setSelectedMealTypeId,
}) => {
  return (
    <div className="h-full w-full flex flex-wrap justify-center items-center py-3 gap-x-5 gap-y-2">
      <span className="w-full sm:w-[30%]">
        <ButtonIlluminated
          label={"Завтрак"}
          isDarkButton={
            selectedMealTypeId == BREAKFAST_DEFAULT_ID ? true : false
          }
          isIlluminationFull={
            selectedMealTypeId == BREAKFAST_DEFAULT_ID ? true : false
          }
          onClick={() => setSelectedMealTypeId(BREAKFAST_DEFAULT_ID)}
          buttonPadding=" p-[14px] "
        />
      </span>
      <span className="w-full sm:w-[30%]">
        <ButtonIlluminated
          label={"Обед"}
          isDarkButton={selectedMealTypeId == LUNCH_DEFAULT_ID ? true : false}
          isIlluminationFull={
            selectedMealTypeId == LUNCH_DEFAULT_ID ? true : false
          }
          onClick={() => setSelectedMealTypeId(LUNCH_DEFAULT_ID)}
          buttonPadding=" p-[14px] "
        />
      </span>
      <span className="w-full sm:w-[30%]">
        <ButtonIlluminated
          label={"Ужин"}
          isDarkButton={selectedMealTypeId == DINNER_DEFAULT_ID ? true : false}
          isIlluminationFull={
            selectedMealTypeId == DINNER_DEFAULT_ID ? true : false
          }
          onClick={() => setSelectedMealTypeId(DINNER_DEFAULT_ID)}
          buttonPadding=" p-[14px] "
        />
      </span>
    </div>
  );
};

export default MealTypeOptions;
