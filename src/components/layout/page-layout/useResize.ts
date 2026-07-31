import { useEffect, useRef, useState } from "react";

const DEFAULT_SIDEBAR_WIDTH = 300;
const DEFAULT_SIDEBAR_SPLIT = 50;
const MIN_SIDEBAR_WIDTH = 300;
const MIN_MAIN_WIDTH = 320;

const RESIZE_HANDLE_SIZE = 8;

const LEFT_WIDTH_STORAGE_KEY = "provideq.sidebar.left.width";
const RIGHT_WIDTH_STORAGE_KEY = "provideq.sidebar.right.width";
const LEFT_SPLIT_STORAGE_KEY = "provideq.sidebar.left.split";
const RIGHT_SPLIT_STORAGE_KEY = "provideq.sidebar.right.split";

interface UseResizeOptions {
  hasLeftSidebar: boolean;
  hasRightSidebar: boolean;
  islandGap: number;
}

export function useResize({
  hasLeftSidebar,
  hasRightSidebar,
  islandGap,
}: UseResizeOptions) {
  const [leftWidth, setLeftWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [rightWidth, setRightWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [leftSplit, setLeftSplit] = useState(DEFAULT_SIDEBAR_SPLIT);
  const [rightSplit, setRightSplit] = useState(DEFAULT_SIDEBAR_SPLIT);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const leftWidthAtDragStart = useRef(leftWidth);
  const rightWidthAtDragStart = useRef(rightWidth);
  const leftSplitAtDragStart = useRef(leftSplit);
  const rightSplitAtDragStart = useRef(rightSplit);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeftWidth(
      getStoredNumber(LEFT_WIDTH_STORAGE_KEY, DEFAULT_SIDEBAR_WIDTH),
    );
    setRightWidth(
      getStoredNumber(RIGHT_WIDTH_STORAGE_KEY, DEFAULT_SIDEBAR_WIDTH),
    );
    setLeftSplit(getStoredSplit(LEFT_SPLIT_STORAGE_KEY));
    setRightSplit(getStoredSplit(RIGHT_SPLIT_STORAGE_KEY));
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (storageLoaded) {
      window.localStorage.setItem(LEFT_WIDTH_STORAGE_KEY, String(leftWidth));
    }
  }, [leftWidth, storageLoaded]);

  useEffect(() => {
    if (storageLoaded) {
      window.localStorage.setItem(RIGHT_WIDTH_STORAGE_KEY, String(rightWidth));
    }
  }, [rightWidth, storageLoaded]);

  useEffect(() => {
    if (storageLoaded) {
      window.localStorage.setItem(LEFT_SPLIT_STORAGE_KEY, String(leftSplit));
    }
  }, [leftSplit, storageLoaded]);

  useEffect(() => {
    if (storageLoaded) {
      window.localStorage.setItem(RIGHT_SPLIT_STORAGE_KEY, String(rightSplit));
    }
  }, [rightSplit, storageLoaded]);

  const getMaximumSidebarWidth = (
    otherSidebarWidth: number,
    hasOtherSidebar: boolean,
  ) => {
    const sidebarGapCount = hasOtherSidebar ? 2 : 1;
    const otherSidebarWidthInLayout = hasOtherSidebar ? otherSidebarWidth : 0;
    const availableWidth =
      window.innerWidth -
      islandGap * 2 -
      islandGap * sidebarGapCount -
      otherSidebarWidthInLayout -
      MIN_MAIN_WIDTH;

    return Math.max(MIN_SIDEBAR_WIDTH, availableWidth);
  };

  const resizeLeftSidebar = (delta: number) => {
    const maximumWidth = getMaximumSidebarWidth(rightWidth, hasRightSidebar);

    setLeftWidth(
      clamp(
        leftWidthAtDragStart.current + delta,
        MIN_SIDEBAR_WIDTH,
        maximumWidth,
      ),
    );
  };

  const resizeRightSidebar = (delta: number) => {
    const maximumWidth = getMaximumSidebarWidth(leftWidth, hasLeftSidebar);

    setRightWidth(
      clamp(
        rightWidthAtDragStart.current + delta,
        MIN_SIDEBAR_WIDTH,
        maximumWidth,
      ),
    );
  };

  const getResizedSplit = (splitAtDragStart: number, delta: number) => {
    const availableHeight = window.innerHeight - islandGap * 3;

    if (availableHeight <= 0) {
      return splitAtDragStart;
    }

    return clamp(splitAtDragStart + (delta / availableHeight) * 100, 0, 100);
  };

  const resizeLeftSidebarSplit = (delta: number) => {
    setLeftSplit(getResizedSplit(leftSplitAtDragStart.current, delta));
  };

  const resizeRightSidebarSplit = (delta: number) => {
    setRightSplit(getResizedSplit(rightSplitAtDragStart.current, delta));
  };

  return {
    leftWidth,
    rightWidth,
    leftSplit,
    rightSplit,
    startResizeLeftSidebar: () => {
      leftWidthAtDragStart.current = leftWidth;
    },
    startResizeRightSidebar: () => {
      rightWidthAtDragStart.current = rightWidth;
    },
    startResizeLeftSidebarSplit: () => {
      leftSplitAtDragStart.current = leftSplit;
    },
    startResizeRightSidebarSplit: () => {
      rightSplitAtDragStart.current = rightSplit;
    },
    resizeLeftSidebar,
    resizeRightSidebar,
    resizeLeftSidebarSplit,
    resizeRightSidebarSplit,
    MIN_MAIN_WIDTH,
    RESIZE_HANDLE_SIZE,
  };
}

function getStoredNumber(key: string, fallback: number) {
  const storedValue = window.localStorage.getItem(key);

  if (storedValue === null) {
    return fallback;
  }

  const parsedValue = Number(storedValue);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function getStoredSplit(key: string) {
  return clamp(getStoredNumber(key, DEFAULT_SIDEBAR_SPLIT), 0, 100);
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
