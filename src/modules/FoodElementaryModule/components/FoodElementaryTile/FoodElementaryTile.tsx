import { FC, useState } from "react";
import { useDeleteFoodElementaryMutation } from "../../api/foodElementary.api";
import FoodElementaryEditForm from "./FoodElementaryEditForm";
import FoodElementaryInfo from "./FoodElementaryInfo";
import { IFoodCharacteristic } from "../../../../global/types/types";
import TileIcons from "../../../../components/TileIcons/TileIcons";

type TProps = {
  id: string;
  name: string;
  characteristics: IFoodCharacteristic[];
};

const FoodElementaryTile: FC<TProps> = ({ id, name, characteristics }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [doDeleteFood] = useDeleteFoodElementaryMutation();

  const deleteFood = async () => {
    await doDeleteFood(id);
  };

  return (
    <div className="outer_box_style group w-full max-w-5xl mt-5">
      <div className="box_style"></div>
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
