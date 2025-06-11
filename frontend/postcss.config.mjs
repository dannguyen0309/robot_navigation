const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  them: {
    extend: {
      keyframes: {
        wall: {
          "0%": {
            transform: "scale(0.7)",
          },
          "100%": {
            transform: "scale(1)",
          },
        },
      },
    },
  },
};

export default config;
