import Preloader from "../Preloader/Preloader";

const LoaderWithBlock = () => {
  return (
    <div className="loader_with_block" onClick={(e) => e.stopPropagation()}>
      <Preloader />
    </div>
  );
};

export default LoaderWithBlock;
