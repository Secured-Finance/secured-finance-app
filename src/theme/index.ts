import { colors } from './colors';
import { sizes } from './sizes';
import { fonts } from './fonts';

const theme = {
	background: "#0f1a22",
	borderRadius: 6,
	colors,
	siteWidth: 1200,
	sizes,
	fonts,
	topBarSize: 72,
	topBarPadding: 26,
	spacing: {
		1: 4,
		2: 8,
		3: 16,
		4: 24,
		5: 32,
		6: 48,
		7: 64,
	},
	breakpoints: {
		mobile: 400,
	},	
}

export default theme