import { FC } from "react";
import { logout } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/hooks";
import { removeTokenFromLocalStorage } from "../../../global/helpers/local_storage.helper";
import { toast } from "react-hot-toast";

const Profile: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleExitAccount = () => {
    dispatch(logout());
    removeTokenFromLocalStorage();
    toast.success("Вы вышли из аккаунта");
    navigate("/");
  };

  return (
    <div>
      <button className="" onClick={(): void => handleExitAccount()}>
        Выйти
      </button>
    </div>
  );
};

export default Profile;
