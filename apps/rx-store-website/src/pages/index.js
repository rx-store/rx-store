import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import carbon from './carbon.png';

const features = [
  {
    title: <>High Performance</>,
    description: (
      <>
        <p>
          Pushes updates for specific changes, unlike other state managers that
          run every reducer on every action, and render every component on every
          change.
        </p>
        <p>
          As a metaphor, this is like receiving a push notification that wakes
          your phone up from sleeping instead of wasting power &amp; data
          polling all the time.
        </p>
      </>
    ),
  },
  {
    title: <>Functional Reactive Programming</>,
    description: (
      <>
        <p>
          Unlike other reactive state managers, Rx Store does not try to make
          imperative code reactive. All code you will be writing in Rx Store can
          be free of mutable shared state, making it easier to test, debug,
          reason about, and share your code.
        </p>
        <p>
          State and side effects aren't strictly separated, and there is no
          dogmatic boilerplate to write, however you are free to layer &amp;
          structure your business logic in this way if desired.
        </p>
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--6', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="The stream management library"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/core/introduction/getting-started')}
            >
              Get Started
            </Link>
          </div>
          <img src={carbon} />
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className="container">
                <div className="row" style={{ justifyContent: 'center' }}>
                  <div className={clsx('col col--6', styles.feature)}>
                    <h3>Devtools</h3>
                    <p>
                      Rx Store is able to track the data flow in your store.
                    </p>
                    <p>
                      Due to Rx Store's unique architecture, the entire store is
                      introspectable. This affordance allows for features such
                      as the interactive 3D data flow visualization.{' '}
                      <a href="/docs/devtools">
                        Read about Devtools for Rx Store
                      </a>
                    </p>
                  </div>
                  <div className={clsx('col col--6', styles.feature)}>
                    <iframe
                      width="560"
                      height="315"
                      src="https://www.youtube-nocookie.com/embed/pI6ALDSD-QE"
                      frameborder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
