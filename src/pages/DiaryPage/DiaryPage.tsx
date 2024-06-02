import { FC } from "react";
import { DiaryModule } from "../../modules/DiaryModule";
import { useParams } from "react-router-dom";

const DiaryPage: FC = () => {
  const params = useParams();

  return (
    <section className="flex flex-col h-fit w-full flex-grow">
      <DiaryModule date={params.date} />
    </section>
  );
};

export default DiaryPage;
