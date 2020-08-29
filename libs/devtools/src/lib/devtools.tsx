import React from 'react';
import { Observable } from 'rxjs';
import { StoreEvent } from '@rx-store/core';
import useLocalStorage from './useLocalStorage';
import { ThemeProvider } from './theme';
import { Panel } from './panel';
import { isServer } from './is-server';

/**
 * Copyright (c) Tanner Linsley, adapted by Josh Ribakoff
 * https://github.com/tannerlinsley/react-query-devtools/blob/master/src/index.js
 */

const theme = {
  background: '#0b1521',
  backgroundAlt: '#132337',
  foreground: 'white',
  gray: '#3f4e60',
  grayAlt: '#222e3e',
  inputBackgroundColor: '#fff',
  inputTextColor: '#000',
  success: '#00ab52',
  danger: '#ff0085',
  active: '#006bff',
  warning: '#ffb200',
};

interface DevtoolsProps {
  initialIsOpen?: boolean;
  panelProps?: { style?: {} };
  closeButtonProps?: { style?: {}; onClick?: () => void };
  toggleButtonProps?: { style?: {}; onClick?: () => void };
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  observable: Observable<StoreEvent>;
}

export const Devtools: React.FC<DevtoolsProps> = (props) => {
  const {
    initialIsOpen = false,
    panelProps = {},
    closeButtonProps = {},
    toggleButtonProps = {},
    position = 'bottom-left',
  } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useLocalStorage(
    'reactQueryDevtoolsOpen',
    initialIsOpen
  );
  const [isResolvedOpen, setIsResolvedOpen] = React.useState(false);

  React.useEffect(() => {
    setIsResolvedOpen(isOpen);
  }, [isOpen, isResolvedOpen]);

  React[isServer ? 'useEffect' : 'useLayoutEffect'](() => {
    if (isResolvedOpen) {
      const previousValue = rootRef.current?.parentElement?.style.paddingBottom;

      const run = () => {
        const containerHeight = panelRef.current?.getBoundingClientRect()
          .height;
        if (rootRef?.current?.parentElement) {
          rootRef.current.parentElement.style.paddingBottom = `${containerHeight}px`;
        }
      };

      run();

      window.addEventListener('resize', run);

      return () => {
        window.removeEventListener('resize', run);
        if (rootRef?.current?.parentElement) {
          rootRef.current.parentElement.style.paddingBottom =
            previousValue || '';
        }
      };
    }
  }, [isResolvedOpen]);

  const { style: panelStyle = {}, ...otherPanelProps } = panelProps;

  const {
    style: closeButtonStyle = {},
    onClick: onCloseClick,
    ...otherCloseButtonProps
  } = closeButtonProps;

  const {
    style: toggleButtonStyle = {},
    onClick: onToggleClick,
    ...otherToggleButtonProps
  } = toggleButtonProps;

  return (
    <div ref={rootRef} className="ReactQueryDevtools">
      {isResolvedOpen ? (
        <ThemeProvider theme={theme}>
          <Panel
            ref={panelRef}
            observable={props.observable}
            {...otherPanelProps}
            style={{
              position: 'fixed',
              bottom: '0',
              right: '0',
              zIndex: '99999',
              width: '100%',
              height: '500px',
              maxHeight: '90%',
              boxShadow: '0 0 20px rgba(0,0,0,.3)',
              borderTop: `1px solid ${theme.gray}`,
              ...panelStyle,
            }}
            setIsOpen={setIsOpen}
          />
          <button
            {...otherCloseButtonProps}
            onClick={() => {
              setIsOpen(false);
              onCloseClick && onCloseClick();
            }}
            style={{
              position: 'fixed',
              zIndex: 99999,
              margin: '.5rem',
              bottom: 0,
              ...(position === 'top-right'
                ? {
                    right: '0',
                  }
                : position === 'top-left'
                ? {
                    left: '0',
                  }
                : position === 'bottom-right'
                ? {
                    right: '0',
                  }
                : {
                    left: '0',
                  }),
              ...closeButtonStyle,
            }}
          >
            Close
          </button>
        </ThemeProvider>
      ) : (
        <button
          {...otherToggleButtonProps}
          aria-label="Open React Query Devtools"
          onClick={() => {
            setIsOpen(true);
            onToggleClick && onToggleClick();
          }}
          style={{
            background: 'none',
            border: 0,
            padding: 0,
            position: 'fixed',
            bottom: '0',
            right: '0',
            zIndex: 99999,
            display: 'inline-flex',
            fontSize: '1.5rem',
            margin: '.5rem',
            cursor: 'pointer',
            ...(position === 'top-right'
              ? {
                  top: '0',
                  right: '0',
                }
              : position === 'top-left'
              ? {
                  top: '0',
                  left: '0',
                }
              : position === 'bottom-right'
              ? {
                  bottom: '0',
                  right: '0',
                }
              : {
                  bottom: '0',
                  left: '0',
                }),
            ...toggleButtonStyle,
          }}
        >
          Rx Store{/* <Logo aria-hidden /> */}
        </button>
      )}
    </div>
  );
};
