import { FC, useRef } from "react";
import { Player } from "@lordicon/react";
import EDIT_ICON from "../../global/assets/settings.json";
import DELETE_ICON from "../../global/assets/trash.json";

type TProps = {
  isEditMode: boolean;
  setIsEditMode: Function;
  handleDelete: Function;
};

const TileIcons: FC<TProps> = ({ isEditMode, setIsEditMode, handleDelete }) => {
  const editIconPlayerRef = useRef<Player>(null);
  const deleteIconPlayerRef = useRef<Player>(null);
  const ICON_SIZE = 28;

  return (
    <>
      <span
        role="button"
        onClick={() => setIsEditMode(!isEditMode)}
        className="remove_tap_highlight"
      >
        <span
          onMouseEnter={() => editIconPlayerRef.current?.playFromBeginning()}
        >
          <Player
            ref={editIconPlayerRef}
            icon={EDIT_ICON}
            size={ICON_SIZE}
            colorize="#0d0b26"
          />
        </span>
      </span>

      <span
        role="button"
        onClick={async () => await handleDelete()}
        className="remove_tap_highlight"
      >
        <span
          onMouseEnter={() => deleteIconPlayerRef.current?.playFromBeginning()}
        >
          <Player
            ref={deleteIconPlayerRef}
            icon={DELETE_ICON}
            size={ICON_SIZE}
            colorize="#0d0b26"
          />
        </span>
      </span>
    </>
  );
};

export default TileIcons;
