import { FC, useState } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import FoodRecipeCreateForm from "./FoodRecipeCreateForm";
import FoodRecipesList from "./FoodRecipesList";

const FoodRecipeModule: FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <section className="h-full w-full flex flex-col justify-center items-center py-3">
      <span className="my-3 w-full max-w-[280px]">
        <ButtonIlluminated
          children={showCreateForm ? "Скрыть" : "Создать блюдо"}
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          illuminationVariant={showCreateForm ? "full" : "light"}
          buttonVariant={showCreateForm ? "dark" : "light"}
        />
      </span>

      {showCreateForm ? (
        <FoodRecipeCreateForm setShowCreateForm={setShowCreateForm} />
      ) : null}

      <FoodRecipesList />
    </section>
  );
};

export default FoodRecipeModule;
