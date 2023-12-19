import { FC, useState } from "react";

import { FoodElementaryModule } from "../../../../modules/FoodElementaryModule";
import { FoodRecipeModule } from "../../../../modules/FoodRecipeModule";
import FoodPageHeader from "../FoodPageHeader/FoodPageHeader.tsx";

const FoodPage: FC = () => {
  const [selectedValue, setSelectedValue] = useState("foodElementary");

  return (
    <section className=" flex flex-col h-fit w-full flex-grow ">
      <FoodPageHeader
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />

      {selectedValue === "foodElementary" ? (
        <FoodElementaryModule />
      ) : selectedValue === "foodRecipe" ? (
        <FoodRecipeModule />
      ) : null}
    </section>
  );
};

export default FoodPage;
