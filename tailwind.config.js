/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      inset: {
        "01": "0.1px",
      },
      blur: {
        xs: "2px",
      },
      scale: {
        101: "1.01",
      },
      animation: {
        tilt: "tilt 10s infinite linear",

        tilt_5_deg: "tilt_5_deg 5s infinite linear",
      },
      keyframes: {
        tilt: {
          "0%, 50%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(1deg)",
          },
          "75%": {
            transform: "rotate(-1deg)",
          },
        },

        tilt_5_deg: {
          "0%, 50%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(5deg)",
          },
          "75%": {
            transform: "rotate(-5deg)",
          },
        },
      },

      backgroundImage: {
        food_img: "url('/food.png')",
      },

      backgroundPosition: {
        bg_position: "right -20rem bottom -25rem",
      },

      flexGrow: {
        10: "10",
        20: "20",
        50: "50",
        100: "100",
      },

      colors: {
        very_light_gray: "#E7E7E9",
        // light_gray: "#565564",
        light_gray: "#474747",

        near_black: "#0d0b26",
        light_near_black: "#535264",

        main_blue: "#7190FF",

        blue: "#C2BAFF",
        light_blue: "#C2BAFF",

        green: "#96B3AF",
        light_green: "#C2D9CE",
        most_light_green: "#F0FFF0",

        deep_blue_sea: "#3d3d4e",

        near_white: "#f8f7f4",
        near_white_dark: "#FFE0B2",

        red: "#FF7777CC",

        main_pink: "#EC4899",
        main_violet: "#8B5CF6",
        main_green: "#ACBC5B",
      },
    },
  },
  plugins: [],
};
