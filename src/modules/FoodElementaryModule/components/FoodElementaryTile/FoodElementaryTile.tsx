import { FC, useState } from "react";
import { useDeleteFoodElementaryMutation } from "../../api/food-elementary.api";
import FoodElementaryEditForm from "./FoodElementaryEditForm";
import FoodElementaryInfo from "./FoodElementaryInfo";
import { IFoodCharacteristic } from "../../../../global/types/entities-types";
import TileIcons from "../../../../components/TileIcons/TileIcons";
import { handleApiCallError } from "../../../../global/helpers/handle-api-call-error.helper";
import { useAppDispatch } from "../../../../global/store/store-hooks";
import { useNavigate } from "react-router-dom";
import LoaderWithBlock from "../../../../components/LoaderWithBlock/LoaderWithBlock";

type TProps = {
  id: string;
  name: string;
  characteristics: IFoodCharacteristic[];
};

const FoodElementaryTile: FC<TProps> = ({ id, name, characteristics }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [mainlIsLoading, setMainIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [doDeleteFood] = useDeleteFoodElementaryMutation();

  const deleteFood = async () => {
    await doDeleteFood(id)
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

      {mainlIsLoading && <LoaderWithBlock />}

      <div className="box_content_transition flex flex-col flex-wrap w-full justify-center items-start p-7">
        <div className="box_icons">
          <TileIcons
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            handleDelete={deleteFood}
          />
        </div>

        {isEditMode ? (
          <FoodElementaryEditForm
            key={`edit_${id}`}
            foodElementaryId={id}
            foodElementaryName={name}
            originalCharacteristics={characteristics}
            setIsEditMode={setIsEditMode}
            isEditMode={isEditMode}
            setMainIsLoading={setMainIsLoading}
          />
        ) : (
          <FoodElementaryInfo
            foodElementaryName={name}
            characteristics={characteristics}
          />
        )}
      </div>
    </div>
  );
};

export default FoodElementaryTile;
