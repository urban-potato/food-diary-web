import ButtonIlluminated from "../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import { FC } from "react";

type FoodPageHeaderProps = {
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
};

const FoodPageHeader: FC<FoodPageHeaderProps> = ({
  selectedValue,
  setSelectedValue,
}) => {
  return (
    <div className="flex flex-wrap justify-center items-center text-center gap-x-5 gap-y-3">
      <span className="w-full  max-w-[280px]">
        <ButtonIlluminated
          children={"Простые блюда"}
          type="button"
          onClick={() => setSelectedValue("foodElementary")}
          illuminationVariant={
            selectedValue === "foodElementary" ? "full" : "light"
          }
          buttonVariant={selectedValue === "foodElementary" ? "dark" : "light"}
        />
      </span>
      <span className="w-full  max-w-[280px]">
        <ButtonIlluminated
          children={"Составные блюда"}
          type="button"
          onClick={() => setSelectedValue("foodRecipe")}
          illuminationVariant={
            selectedValue === "foodRecipe" ? "full" : "light"
          }
          buttonVariant={selectedValue === "foodRecipe" ? "dark" : "light"}
        />
      </span>
    </div>
  );
};

export default FoodPageHeader;
