import { FC, useState } from "react";

import { FoodElementaryModule } from "../../modules/FoodElementaryModule/index.ts";
import { FoodRecipeModule } from "../../modules/FoodRecipeModule/index.tsx";
import FoodPageHeader from "./FoodPageHeader.tsx";

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
