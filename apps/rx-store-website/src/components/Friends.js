import React from 'react';
import Layout from '@theme/Layout';

export default ({ friends }) => {
  return (
    <Layout title="Hello">
      <div dangerouslySetInnerHTML={{ __html: friends }} />
    </Layout>
  );
};
