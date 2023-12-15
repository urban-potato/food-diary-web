import { useState } from "react";
import { FoodPageHeader } from "../../modules/FoodModule";
import { FoodElementaryModule } from "../../modules/FoodElementaryModule";
import { FoodRecipeModule } from "../../modules/FoodRecipeModule";

const FoodPage = () => {
  const [selectedValue, setSelectedValue] = useState("foodElementary");

  return (
    <section className=" flex flex-col h-fit w-full">
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
