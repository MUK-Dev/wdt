import React from 'react';

import AuthGuard from '../../utils/AuthGuard';

const CheckListPage = () => {
  return (
    <AuthGuard>
      <div>CheckListPage</div>
    </AuthGuard>
  );
};

export default CheckListPage;
