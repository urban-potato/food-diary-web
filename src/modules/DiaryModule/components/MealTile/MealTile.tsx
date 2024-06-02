import { FC, useState } from "react";
import { useDeleteCourseMealMutation } from "../../api/meal.api";
import MealEditForm from "./MealEditForm";
import { ICourseMeal } from "../../../../global/types/entities-types";
import MealTileBody from "./MealTileBody";
import TileIcons from "../../../../components/TileIcons/TileIcons";
import { useAppDispatch } from "../../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import { handleApiCallError } from "../../../../global/helpers/handle-api-call-error.helper";

const MealTile: FC<ICourseMeal> = ({
  id,
  creationTime,
  mealTypeId,
  mealTypeName,
  consumedElementaries,
  consumedRecipes,
  characteristicsSum,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

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
    <div className="outer_box_style group w-full max-w-5xl mt-5">
      <div className="box_style"></div>
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
            courseMealId={id}
            originalMealTypeId={mealTypeId}
            consumedElementaries={consumedElementaries}
            consumedRecipes={consumedRecipes}
            setIsEditMode={setIsEditMode}
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
