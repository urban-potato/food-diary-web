import { useEffect, useRef } from "react";
import { Player } from "@lordicon/react";
import PRELOADER from "../../global/assets/system-regular-18-autorenew.json";

const Preloader = () => {
  const preloaderPlayerRef = useRef<Player>(null);

  useEffect(() => {
    preloaderPlayerRef.current?.playFromBeginning();
  });

  return (
    <Player
      ref={preloaderPlayerRef}
      icon={PRELOADER}
      size={100}
      colorize="#0d0b26"
      onComplete={() => preloaderPlayerRef.current?.playFromBeginning()}
    />
  );
};

export default Preloader;
