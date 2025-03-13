module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          animation: {
            fadeIn: "fadeIn 1s ease-out", // Add fadeIn animation
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            },
          },
        },
      },
    plugins: [],
  }
  