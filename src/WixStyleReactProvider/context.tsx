import React from "react";
import type { Features } from "./types";

export const WixStyleReactContext = React.createContext<Features>({
	newColorsBranding: false,
	sidebarExperimentCollapsible: false,
});
