import React, { useState } from 'react';

import { Typography, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const EditableContent = ({
  text,
  setText,
  label = 'Edit',
  variant = 'h2',
  canEdit = true,
  title = '',
}) => {
  const [showText, setShowText] = useState(true);
  const theme = useTheme();

  return showText ? (
    <Typography
      variant={variant}
      sx={{ maxWidth: '100%' }}
      color={variant === 'h2' && theme.palette.success.dark}
      margin='0.2em 0'
      onClick={() => canEdit && setShowText(false)}
    >
      {`${title} ${text}`}
    </Typography>
  ) : (
    <TextField
      label={label}
      variant='outlined'
      value={text}
      color='secondary'
      autoFocus
      onBlur={() => setShowText(true)}
      margin='dense'
      onChange={({ target }) => setText(target.value)}
    />
  );
};

export default EditableContent;
