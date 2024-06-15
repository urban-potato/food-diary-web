import { FC } from "react";
import { DiaryModule } from "../../modules/DiaryModule";
import { useParams } from "react-router-dom";
import ErrorPage from "../ErrorPage/ErrorPage";

const DiaryPage: FC = () => {
  const params = useParams();
  const paramsDate = params.date;
  const requiredDate = !!paramsDate ? new Date(paramsDate) : new Date();

  if (Number.isNaN(requiredDate.getDate())) {
    return <ErrorPage />;
  }

  return (
    <section className="flex flex-col h-fit w-full flex-grow max-w-full">
      <DiaryModule requiredDate={requiredDate} />
    </section>
  );
};

export default DiaryPage;
