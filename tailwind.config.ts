import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				"zt-bros": ["var(--font-zt-bros-oskon)"],
				"zt-formom": ["var(--font-zt-formom)"],
				"helvetica-bold": ["var(--font-helvetica-bold)"],
				ingenious: ["var(--font-ingenious)"],
				melodrame: ["var(--font-relationship-melodrame)"],
			},
		},
	},
	plugins: [],
};
export default config;
