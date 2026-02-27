import { LIKERT_OPTIONS } from "../../utils/constants";
import LikertOptionCard from "./LikertOptionCard";

function LikertScale({ value, onChange, disabled }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Response options">
      {LIKERT_OPTIONS.map((option) => {
        return (
          <LikertOptionCard
            key={option.value}
            label={option.label}
            selected={value === option.value}
            disabled={disabled}
            onClick={() => onChange(option.value)}
          />
        );
      })}
    </div>
  );
}

export default LikertScale;
