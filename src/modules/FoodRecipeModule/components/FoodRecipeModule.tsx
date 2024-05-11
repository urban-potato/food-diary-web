import { FC, useState } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import FoodRecipeCreateForm from "./FoodRecipeCreateForm";
import FoodRecipeList from "./FoodRecipeList";

const FoodRecipeModule: FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <section
      className=" h-full w-full 
                  flex flex-col 
                  justify-center items-center 
                  py-3 "
    >
      <span className=" my-3 w-full max-w-[280px] ">
        <ButtonIlluminated
          label={showCreateForm ? "Скрыть" : "Создать блюдо"}
          isDarkButton={showCreateForm}
          isIlluminationFull={showCreateForm ? true : false}
          onClick={() => setShowCreateForm(!showCreateForm)}
          //   additionalStyles=" w-[280px] "
          //   additionalStyles=" max-w-[280px] "
          buttonPadding=" p-[14px] "
        />
      </span>

      {showCreateForm ? (
        <FoodRecipeCreateForm setShowCreateForm={setShowCreateForm} />
      ) : null}

      <FoodRecipeList />
    </section>
  );
};

export default FoodRecipeModule;
