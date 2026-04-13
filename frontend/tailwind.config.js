/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        // možeš dodati i sve ostale varijable iz index.css
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
  plugins: [
    // ovdje ide plugin ako koristiš shadcn
    // npr. require("shadcn/tailwind-plugin")
  ],
};
