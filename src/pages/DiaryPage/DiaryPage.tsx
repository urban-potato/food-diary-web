import { FC } from "react";
import { DiaryModule } from "../../modules/DiaryModule";

const DiaryPage: FC = () => {
  return (
    <section className=" flex flex-col h-fit w-full flex-grow">
      <DiaryModule />
    </section>
  );
};

export default DiaryPage;
