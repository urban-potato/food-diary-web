import { FoodPageHeaderProps } from "./types/types.tsx";
import ButtonIlluminated from "../../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import { FC } from "react";

const FoodPageHeader: FC<FoodPageHeaderProps> = ({
  selectedValue,
  setSelectedValue,
}) => {
  return (
    <div
      className="flex flex-wrap 
    justify-center items-center 
    text-center 
    gap-x-5
    gap-y-3
    "
    >
      <span className=" w-full  max-w-[280px] ">
        <ButtonIlluminated
          label="Простые блюда"
          isDarkButton={selectedValue === "foodElementary"}
          isIlluminationFull={selectedValue === "foodElementary" ? true : false}
          onClick={() => setSelectedValue("foodElementary")}
          buttonPadding=" p-[14px] "
        />
      </span>
      <span className=" w-full  max-w-[280px] ">
        <ButtonIlluminated
          label="Составные блюда"
          isDarkButton={selectedValue === "foodRecipe"}
          isIlluminationFull={selectedValue === "foodRecipe" ? true : false}
          onClick={() => setSelectedValue("foodRecipe")}
          buttonPadding=" p-[14px] "
        />
      </span>
    </div>
  );
};

export default FoodPageHeader;
