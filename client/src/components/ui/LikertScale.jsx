import { useRef } from "react";
import { LIKERT_OPTIONS } from "../../utils/constants";
import LikertOptionCard from "./LikertOptionCard";

function LikertScale({ value, onChange, disabled }) {
  const optionRefs = useRef([]);

  function focusOption(index) {
    optionRefs.current[index]?.focus();
  }

  function handleOptionKeyDown(event, index) {
    if (disabled) {
      return;
    }

    const directValue = Number(event.key);
    const directIndex = LIKERT_OPTIONS.findIndex((option) => option.value === directValue);

    if (directIndex >= 0) {
      event.preventDefault();
      onChange(LIKERT_OPTIONS[directIndex].value);
      focusOption(directIndex);
      return;
    }

    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = Math.min(index + 1, LIKERT_OPTIONS.length - 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = Math.max(index - 1, 0);
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = LIKERT_OPTIONS.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextValue = LIKERT_OPTIONS[nextIndex].value;
    onChange(nextValue);
    focusOption(nextIndex);
  }

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-5"
      role="radiogroup"
      aria-label="Response options"
    >
      {LIKERT_OPTIONS.map((option, index) => {
        return (
          <LikertOptionCard
            key={option.value}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            label={option.label}
            helperText={`Press ${option.value}`}
            selected={value === option.value}
            disabled={disabled}
            tabIndex={
              value === option.value || (value == null && index === 0) ? 0 : -1
            }
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleOptionKeyDown(event, index)}
          />
        );
      })}
    </div>
  );
}

export default LikertScale;
