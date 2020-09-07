import React from 'react';
import Layout from '@theme/Layout';

export default ({ __content, __menu }) => {
  return (
    <Layout title="API docs">
      <div class="container">
        <div class="row">
          <div class="col col--8" style={{ paddingTop: 15, paddingBottom: 15 }}>
            <div dangerouslySetInnerHTML={{ __html: __content }} />
          </div>
          <div class="col col--4">
            <div dangerouslySetInnerHTML={{ __html: __menu }} />
          </div>
        </div>
      </div>
    </Layout>
  );
};
