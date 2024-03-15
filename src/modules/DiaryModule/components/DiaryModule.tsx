import { useState } from "react";
import ButtonIlluminated from "../../../ui/ButtonIlluminated/ButtonIlluminated";
import MealCreateForm from "./MealCreateForm";
import MealsList from "./MealsList";

const DiaryModule = () => {
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
          label={showCreateForm ? "Скрыть" : "Новая запись"}
          isDarkButton={showCreateForm}
          isIlluminationFull={showCreateForm ? true : false}
          onClick={() => setShowCreateForm(!showCreateForm)}
          buttonPadding=" p-[14px] "
        />
      </span>

      {showCreateForm ? (
        <MealCreateForm setShowCreateForm={setShowCreateForm} />
      ) : null}

      <MealsList />
    </section>
  );
};

export default DiaryModule;
