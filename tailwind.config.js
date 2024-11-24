/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
          colors: {
            primary: "#F8B500",
            secondary: {
              DEFAULT: "#FF9C01",
              100: "#FF9001",
              200: "#FF8E01",
            },
            black: {
              DEFAULT: "#000",
              100: "#1E1E2D",
              200: "#232533",
            },
            gray: {
              100: "#CDCDE0",
              200: "#393E46"
            },
          },
          fontFamily: {
            mthin: ["Montserrat-Thin", "sans-serif"],
            mextralight: ["Montserrat-ExtraLight", "sans-serif"],
            mlight: ["Montserrat-Light", "sans-serif"],
            mregular: ["Montserrat-Regular", "sans-serif"],
            mmedium: ["Montserrat-Medium", "sans-serif"],
            msemibold: ["Montserrat-SemiBold", "sans-serif"],
            mbold: ["Montserrat-Bold", "sans-serif"],
            mextrabold: ["Montserrat-ExtraBold", "sans-serif"],
            mblack: ["Montserrat-Black", "sans-serif"],
            mthinItalic: ["Montserrat-ThinItalic", "sans-serif"],
            mextralightItalic: ["Montserrat-ExtraLightItalic", "sans-serif"],
            mlightItalic: ["Montserrat-LightItalic", "sans-serif"],
            mItalic: ["Montserrat-Italic", "sans-serif"],
            mmediumItalic: ["Montserrat-MediumItalic", "sans-serif"],
            msemiboldItalic: ["Montserrat-SemiBoldItalic", "sans-serif"],
            mboldItalic: ["Montserrat-Bold", "sans-serif"],
            mextraboldItalic: ["Montserrat-ExtraBoldItalic", "sans-serif"],
            mblackItalic: ["Montserrat-BlackItalic", "sans-serif"],
          },
        },
      },
    plugins: [],
  }