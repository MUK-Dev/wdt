import { useTheme } from '@mui/material/styles';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();
  return (
    <svg
      id='Layer_1'
      data-name='Layer 1'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 175 68'
      width='92'
      height='32'
    >
      <text
        style={{
          fontSize: '83px',
          fill: theme.palette.secondary.main,
          fontFamily: "Bauhaus93, 'Bauhaus 93'",
        }}
        transform='translate(0 63.36)'
      >
        WDT
      </text>
    </svg>
  );
};

export default Logo;
