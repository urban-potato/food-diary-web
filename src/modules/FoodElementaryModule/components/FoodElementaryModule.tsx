import { useState } from "react";
import FoodElementaryCreateForm from "./FoodElementaryCreateForm";
import FoodElementaryAllView from "./FoodElementaryAllView";
import IlluminatedButton from "../../../ui/IlluminatedButton.tsx";

const FoodElementaryModule = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <section
      className=" h-full w-full 
    flex flex-col 
    justify-center items-center 



    py-3"
    >
      <span className="my-3 w-full  max-w-[280px] ">
        <IlluminatedButton
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
        <FoodElementaryCreateForm setShowCreateForm={setShowCreateForm} />
      ) : null}

      <FoodElementaryAllView />
    </section>
  );
};

export default FoodElementaryModule;
