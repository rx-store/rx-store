import React from 'react';
import Layout from '@theme/Layout';

export default ({ __html }) => {
  return (
    <Layout title="API docs">
      <div dangerouslySetInnerHTML={{ __html }} />
    </Layout>
  );
};
