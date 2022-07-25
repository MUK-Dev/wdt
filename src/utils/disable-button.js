export const disableButton = (isLoading, changeDone, canEdit) => {
  if (isLoading) return true;
  if (!canEdit) return true;
  if (!changeDone) return true;
  else return false;
};
