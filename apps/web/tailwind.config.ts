import daisyUi from "daisyui";
import type { Config } from "tailwindcss";

const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyUi],
} satisfies Config;

export default config;
