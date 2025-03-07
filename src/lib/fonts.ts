import { NextFont } from "next/dist/compiled/@next/font";
import {
	Playfair_Display,
	Roboto,
	Montserrat,
	Oswald,
	Cormorant,
} from "next/font/google";

// Playfair Display as a replacement for ZT Bros Oskon 90s
export const ztBrosOskon = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-zt-bros-oskon",
	display: "swap",
});

// Cormorant as a replacement for ZT Formom
export const ztFormom = Cormorant({
	subsets: ["latin"],
	variable: "--font-zt-formom",
	display: "swap",
});

// Roboto Bold as a replacement for Helvetica Bold
export const helveticaBold = Roboto({
	subsets: ["latin"],
	weight: ["700"],
	variable: "--font-helvetica-bold",
	display: "swap",
});

// Oswald as a replacement for Ingenious
export const ingenious = Oswald({
	subsets: ["latin"],
	variable: "--font-ingenious",
	display: "swap",
});

// Montserrat as a replacement for Relationship of Melodrame
export const relationshipMelodrame = Montserrat({
	subsets: ["latin"],
	variable: "--font-relationship-melodrame",
	display: "swap",
});
