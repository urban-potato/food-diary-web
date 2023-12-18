import { IFoodPageHeaderData } from "../types/types";
import IlluminatedButton from "../../../ui/IlluminatedButton.tsx";

const FoodPageHeader = ({
  selectedValue,
  setSelectedValue,
}: IFoodPageHeaderData) => {
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
        <IlluminatedButton
          label="Простые блюда"
          isDarkButton={selectedValue === "foodElementary"}
          isIlluminationFull={selectedValue === "foodElementary" ? true : false}
          onClick={() => setSelectedValue("foodElementary")}
          // additionalStyles=" max-w-[280px] "
          buttonPadding=" p-[14px] "
        />
      </span >
      <span className=" w-full  max-w-[280px] ">
        <IlluminatedButton
          label="Составные блюда"
          isDarkButton={selectedValue === "foodRecipe"}
          isIlluminationFull={selectedValue === "foodRecipe" ? true : false}
          onClick={() => setSelectedValue("foodRecipe")}
          // additionalStyles=" w-[280px] "
          buttonPadding=" p-[14px] "
        />
      </span>
    </div>
  );
};

export default FoodPageHeader;
