const cheerio = require('cheerio');
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
        const permalink = pathName.replace(
          /^\//,
          (baseUrl || '') + (options.route || '')
        );
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
          const html = fs.readFileSync(metadata.source).toString('utf8');
          const $ = cheerio.load(html);
          const __content = await createData(
            `${docuHash(metadata.source)}.content.json`,
            JSON.stringify($('.col-content').html(), null, 2)
          );
          const __title = await createData(
            `${docuHash(metadata.source)}.title.json`,
            JSON.stringify($('.tsd-page-title .container').html(), null, 2)
          );
          const __menu = await createData(
            `${docuHash(metadata.source)}.menu.json`,
            JSON.stringify($('.col-menu').html(), null, 2)
          );
          addRoute({
            path: permalink,
            component: '@site/src/components/Apidocs.js',
            exact: true,
            modules: {
              __content,
              __menu,
              __title,
            },
          });
        })
      );
    },
  };
};
