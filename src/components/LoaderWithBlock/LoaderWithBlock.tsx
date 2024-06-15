import { FC } from "react";
import Preloader from "../Preloader/Preloader";

const LoaderWithBlock: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
}) => {
  return (
    <div className={className} onClick={(e) => e.stopPropagation()}>
      <Preloader />
    </div>
  );
};

export default LoaderWithBlock;
