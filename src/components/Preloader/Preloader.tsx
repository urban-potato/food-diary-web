import preloader from "../../global/assets/preloader.svg";

const Preloader = () => {
  return (
    <div className="text-center">
      <img src={preloader} alt={"preloader"} />
    </div>
  );
};

export default Preloader;
