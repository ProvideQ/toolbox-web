import { useEffect, useState } from "react";

const DEFAULT_SIDEBAR_WIDTH = 300;
const MIN_SIDEBAR_WIDTH = 300;
const MIN_MAIN_WIDTH = 320;

const LAYOUT_PADDING = 8;
const RESIZE_HANDLE_WIDTH = 8;

const LEFT_STORAGE_KEY = "provideq.sidebar.left.width";
const RIGHT_STORAGE_KEY = "provideq.sidebar.right.width";

export function useResize() {
  const [leftWidth, setLeftWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [rightWidth, setRightWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeftWidth(getStoredWidth(LEFT_STORAGE_KEY, DEFAULT_SIDEBAR_WIDTH));
    setRightWidth(getStoredWidth(RIGHT_STORAGE_KEY, DEFAULT_SIDEBAR_WIDTH));
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    window.localStorage.setItem(LEFT_STORAGE_KEY, String(leftWidth));
  }, [leftWidth, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    window.localStorage.setItem(RIGHT_STORAGE_KEY, String(rightWidth));
  }, [rightWidth, storageLoaded]);

  const getMaximumSidebarWidth = (otherSidebarWidth: number) => {
    const availableWidth =
      window.innerWidth -
      LAYOUT_PADDING * 2 -
      RESIZE_HANDLE_WIDTH * 2 -
      otherSidebarWidth -
      MIN_MAIN_WIDTH;

    return Math.max(MIN_SIDEBAR_WIDTH, availableWidth);
  };

  const resizeLeftSidebar = (delta: number) => {
    setLeftWidth((currentWidth) => {
      const maximumWidth = getMaximumSidebarWidth(rightWidth);

      return Math.min(
        maximumWidth,
        Math.max(MIN_SIDEBAR_WIDTH, currentWidth + delta),
      );
    });
  };

  const resizeRightSidebar = (delta: number) => {
    setRightWidth((currentWidth) => {
      const maximumWidth = getMaximumSidebarWidth(leftWidth);

      return Math.min(
        maximumWidth,
        Math.max(MIN_SIDEBAR_WIDTH, currentWidth + delta),
      );
    });
  };

  return {
    leftWidth,
    rightWidth,
    resizeLeftSidebar,
    resizeRightSidebar,
    MIN_MAIN_WIDTH,
    LAYOUT_PADDING,
    RESIZE_HANDLE_WIDTH,
  };
}

function getStoredWidth(key: string, fallback: number) {
  const storedValue = window.localStorage.getItem(key);
  const parsedValue = Number(storedValue);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}
