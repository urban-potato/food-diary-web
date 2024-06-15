import { FC } from "react";

const Homepage: FC = () => {
  return (
    <section className="overflow-hidden relative bg-food_img bg-no-repeat w-full h-full flex-grow bg-bg_position rounded-3xl">
      <section className="flex flex-col gap-y-3 max-w-4xl">
        <section
          className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl 2xl:text-7xl px-5 pt-5 
          sm:px-11 sm:pt-14 md:px-16 md:pt-28 lg:px-16 lg:pt-28"
        >
          <div className="relative">
            <div className="absolute bg-clip-text text-transparent bg-near_white font-bold">
              <p className="text_border bg-blur">
                Начни вести дневник питания!
              </p>
            </div>
            <p className="relative bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 font-bold">
              Начни вести дневник питания!
            </p>
          </div>
        </section>

        <section className="text-xl md:text-xl lg:text-2xl 2xl:text-2xl px-5 sm:px-11 md:px-16 lg:px-16">
          <div className="relative">
            <div className="absolute bg-clip-text text-transparent bg-near_white leading-relaxed">
              <p className="text_border bg-blur">
                Дневник питания помогает осознать привычки, контролировать
                питание и улучшить здоровье.
              </p>
            </div>
            <p className="relative leading-relaxed">
              Дневник питания помогает осознать привычки, контролировать питание
              и улучшить здоровье.
            </p>
          </div>
        </section>
      </section>
    </section>
  );
};

export default Homepage;
