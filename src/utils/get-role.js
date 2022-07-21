export const getRole = (grade) => {
  let role;
  if (grade === 0) role = 'Manager';
  else if (grade === 1) role = 'Requested';
  else if (grade === 2) role = 'User';
  else role = '';
  return role;
};
