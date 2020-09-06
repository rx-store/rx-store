const path = require('path');
const globby = require('globby');
const fs = require('fs');
const {
  encodePath,
  fileToPath,
  aliasedSitePath,
  docuHash,
} = require('@docusaurus/utils');

const isHTML = (source) => source.endsWith('.html');

module.exports = function (context, options) {
  const { siteConfig, siteDir, generatedFilesDir } = context;
  const contentPath = path.resolve(siteDir, options.path);
  return {
    name: 'my-docusaurus-plugin',
    async loadContent() {
      const { include } = options;
      const pagesDir = contentPath;
      if (!fs.existsSync(pagesDir)) {
        return null;
      }
      const { baseUrl } = siteConfig;
      const pagesFiles = await globby(include, {
        cwd: pagesDir,
        // ignore: options.exclude,
      });
      function toMetadata(relativeSource) {
        const source = path.join(pagesDir, relativeSource);
        const aliasedSourcePath = aliasedSitePath(source, siteDir);
        const pathName = encodePath(fileToPath(relativeSource));
        console.log(pathName);
        const permalink = pathName.replace(/^\//, baseUrl || '');
        console.log(permalink);
        if (isHTML(relativeSource)) {
          return {
            permalink,
            source, //: aliasedSourcePath,
          };
        }
      }
      return pagesFiles.map(toMetadata);
    },
    async contentLoaded({ content, actions }) {
      if (!content) {
        return;
      }

      const { addRoute, createData } = actions;
      await Promise.all(
        content.map(async (metadata) => {
          const { permalink, source } = metadata;
          //   console.log(`${docuHash(metadata.source)}.json`, { metadata });
          const html = fs.readFileSync(metadata.source);
          const friends = await createData(
            // Note that this created data path must be in sync with
            // metadataPath provided to mdx-loader.
            `${docuHash(metadata.source)}.json`,
            JSON.stringify(html.toString('utf-8'), null, 2)
          );
          console.log(source);
          addRoute({
            path: permalink,
            component: '@site/src/components/Friends.js',
            exact: true,
            modules: {
              //   content: source,
              friends,
            },
          });
        })
      );
    },
  };
};
