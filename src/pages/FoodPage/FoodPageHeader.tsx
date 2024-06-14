import { useNavigate } from "react-router-dom";
import ButtonIlluminated from "../../ui/ButtonIlluminated/ButtonIlluminated.tsx";
import { FC } from "react";
import { FOOD_TYPE, ROUTES_LIST } from "../../global/constants/constants.ts";

type FoodPageHeaderProps = {
  foodType: string;
};

const FoodPageHeader: FC<FoodPageHeaderProps> = ({ foodType }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center items-center text-center gap-x-5 gap-y-3">
      <span className="w-full  max-w-[280px]">
        <ButtonIlluminated
          children={"Простые блюда"}
          type="button"
          onClick={() => navigate(ROUTES_LIST.foodSimple)}
          illuminationVariant={foodType === FOOD_TYPE.simple ? "full" : "light"}
          buttonVariant={foodType === FOOD_TYPE.simple ? "dark" : "light"}
        />
      </span>
      <span className="w-full  max-w-[280px]">
        <ButtonIlluminated
          children={"Составные блюда"}
          type="button"
          onClick={() => navigate(ROUTES_LIST.foodComplex)}
          illuminationVariant={
            foodType === FOOD_TYPE.complex ? "full" : "light"
          }
          buttonVariant={foodType === FOOD_TYPE.complex ? "dark" : "light"}
        />
      </span>
    </div>
  );
};

export default FoodPageHeader;
