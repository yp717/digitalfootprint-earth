const proseClasses = ["h1", "h2", "h3", "h4", "h5", "h6"].reduce((acc, cur) => {
  acc[cur] = {
    color: "#FBBF24",
  };
  return acc;
}, {});


module.exports = {
  variants: {},
  theme: {
    extend:{
      typography: {
        primary: {
          css: {
            color: "#fff",
            strong: {
              color: "#fff",
            },
            ...proseClasses
          },
        },
    }
  },
  },
  purge: {
    content: [
      "./public/**/*.html",
      "./src/**/*.html",
      "./src/**/*.jsx",
      "./src/**/*.js",
    ],
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}
