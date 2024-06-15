import { FC, useState } from "react";
import { useDeleteCourseMealMutation } from "../../api/meal.api";
import MealEditForm from "./MealEditForm";
import { ICourseMeal } from "../../../../global/types/entities-types";
import MealTileBody from "./MealTileBody";
import TileIcons from "../../../../components/TileIcons/TileIcons";
import { useAppDispatch } from "../../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../../global/helpers/handle-api-call-error.helper";
import { cn } from "../../../../global/helpers/cn.helper";
import LoaderWithBlock from "../../../../components/LoaderWithBlock/LoaderWithBlock";

type TProps = {
  mealDayId: string;
} & ICourseMeal &
  React.HTMLAttributes<HTMLDivElement>;

const MealTile: FC<TProps> = ({
  id,
  creationTime,
  mealTypeId,
  mealTypeName,
  consumedElementaries,
  consumedRecipes,
  characteristicsSum,
  mealDayId,
  className,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [mainlIsLoading, setMainIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [doDeleteCourseMeal] = useDeleteCourseMealMutation();
  const deleteMeal = async () => {
    await doDeleteCourseMeal(id)
      .unwrap()
      .catch((error) => {
        handleApiCallError({
          error: error,
          dispatch: dispatch,
          navigate: navigate,
        });
      });
  };

  return (
    <div
      className={cn(
        "outer_box_style group w-full max-w-5xl mt-5 overflow-hidden",
        className
      )}
    >
      <div className="box_style"></div>

      {mainlIsLoading && <LoaderWithBlock />}

      <div className="box_content_transition flex flex-col flex-wrap w-full justify-center items-start p-7">
        <div className="box_icons">
          <TileIcons
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            handleDelete={deleteMeal}
          />
        </div>

        {isEditMode ? (
          <MealEditForm
            originalCourseMealId={id}
            originalCreationTime={creationTime}
            originalMealTypeId={mealTypeId}
            originalConsumedElementaries={consumedElementaries}
            originalConsumedRecipes={consumedRecipes}
            setIsEditMode={setIsEditMode}
            isEditMode={isEditMode}
            originalMealDayId={mealDayId}
            setMainIsLoading={setMainIsLoading}
          />
        ) : (
          <MealTileBody
            creationTime={creationTime}
            mealTypeName={mealTypeName}
            consumedElementaries={consumedElementaries}
            consumedRecipes={consumedRecipes}
            characteristicsSum={characteristicsSum}
          />
        )}
      </div>
    </div>
  );
};

export default MealTile;
