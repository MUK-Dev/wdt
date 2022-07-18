import { createTheme } from '@mui/material/styles';

import Palette from './palette';
import Typography from './typography';
import customShadows from './shadows';
import componentStyleOverrides from './compStyleOverrides';

const theme = Palette;
const themeTypography = Typography(theme, 8, "'Poppins', sans-serif");
const themeCustomShadows = customShadows('light', theme);

const themeOptions = {
  direction: 'ltr',
  palette: theme.palette,
  mixins: {
    toolbar: {
      minHeight: '48px',
      padding: '16px',
      '@media (min-width: 600px)': {
        minHeight: '48px',
      },
    },
  },
  typography: themeTypography,
  customShadows: themeCustomShadows,
};

const mainThemes = createTheme(themeOptions);

mainThemes.components = componentStyleOverrides(mainThemes, 8, false);

export default mainThemes;
