import { FC, useState } from "react";
import FoodElementaryCreateForm from "./FoodElementaryCreateForm";
import FoodElementaryList from "./FoodElementaryList.tsx";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated.tsx";

const FoodElementaryModule: FC = () => {
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
          children={showCreateForm ? "Скрыть" : "Создать блюдо"}
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          illuminationVariant={showCreateForm ? "full" : "light"}
          buttonVariant={showCreateForm ? "dark" : "light"}
        />
      </span>

      {showCreateForm ? (
        <FoodElementaryCreateForm setShowCreateForm={setShowCreateForm} />
      ) : null}

      <FoodElementaryList />
    </section>
  );
};

export default FoodElementaryModule;
