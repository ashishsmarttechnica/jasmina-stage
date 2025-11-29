import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";

// Custom hook to detect if text is truncated
export function useIsTruncated(ref) {
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [ref]);

  return isTruncated;
}

// Component for subtitle with conditional tooltip
export const SubtitleWithTooltip = ({ subtitle, id }) => {
  const ref = useRef(null);
  const isTruncated = useIsTruncated(ref);

  return (
    <>
      <p
        ref={ref}
        className="text-grayBlueText truncate-12-words mt-0.5 text-[10px] font-normal"
        data-tooltip-id={isTruncated ? `subtitle-tooltip-${id}` : undefined}
        data-tooltip-content={isTruncated ? subtitle : undefined}
      >
        {subtitle}
      </p>
      {isTruncated && <Tooltip id={`subtitle-tooltip-${id}`} />}
    </>
  );
};

// Component for name with conditional tooltip
export const NameWithTooltip = ({ name, id, onClick }) => {
  const ref = useRef(null);
  const isTruncated = useIsTruncated(ref);

  return (
    <>
      <p
        ref={ref}
        className="truncate-8-words cursor-pointer text-xs font-medium"
        onClick={onClick}
        data-tooltip-id={isTruncated ? `name-tooltip-${id}` : undefined}
        data-tooltip-content={isTruncated ? name : undefined}
      >
        {name}
      </p>
      {isTruncated && <Tooltip id={`name-tooltip-${id}`} />}
    </>
  );
};
