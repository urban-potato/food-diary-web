import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../global/store/hooks";
import { logout } from "../slices/userSlice";
import { removeTokenFromLocalStorage } from "../../../global/helpers/local_storage.helper";
import { toast } from "react-hot-toast";

const ProfileModule = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleExitAccount = () => {
    dispatch(logout());
    removeTokenFromLocalStorage();
    toast.success("Вы вышли из аккаунта");
    navigate("/");
  };

  return (
    <button className="btn btn_dark" onClick={(): void => handleExitAccount()}>
      Выйти
    </button>
  );
};

export default ProfileModule;
