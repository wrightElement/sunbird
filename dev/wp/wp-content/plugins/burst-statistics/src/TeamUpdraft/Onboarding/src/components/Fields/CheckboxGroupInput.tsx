import Icon from '@/utils/Icon';
import { memo } from 'react';
import { __ } from '@wordpress/i18n';
import * as Checkbox from '@radix-ui/react-checkbox';

interface CheckboxGroupInputProps {
  field: {};
  /** If true, the field displays an indeterminate (or overridden) state */
  indeterminate?: boolean;
  /** Label for the group used in aria-label */
  label: string;
  /** The current value; can be a boolean (for a single toggle) or an array for multi-selection */
  value: any;
  /** Base id for the element */
  id: string;
  /** Callback when the value changes */
  onChange: (value: any) => void;
  /** If true, the field is required */
  required?: boolean;
  /**
   * If a boolean is provided then it disables the whole field; if an array is provided, only the matching option(s) are disabled
   */
  disabled?: boolean | string[];
  /** A record of options in the format { optionId: optionLabel } */
  options: Record<string, string>;
}

/**
 * CheckboxGroupInput component
 *
 * Renders a group of checkboxes based on the options provided.
 * Supports a boolean mode when one option is provided as well as a load-more functionality.
 */
const CheckboxGroupInput: React.FC<CheckboxGroupInputProps> = ({
  field,
  label,
  value,
  id,
  onChange,
  required,
  disabled,
  options = {},
}) => {

  // Convert incoming value to an array if not already one
  let valueValidated: any = value;
  if (!Array.isArray(valueValidated)) {
    valueValidated = valueValidated === '' ? [] : [valueValidated];
  }

  const selected = Array.isArray(valueValidated) ? valueValidated : [];

  /**
   * Handles a change on an individual checkbox.
   * For boolean mode, simply toggles the value.
   * Otherwise, adds or removes the selected option.
   */
  const handleCheckboxChange = (_checked: boolean, option: string) => {
    const newSelected = selected.includes('' + option) || selected.includes(parseInt(option))
      ? selected.filter((item: any) => item !== '' + option && item !== parseInt(option))
      : [...selected, option];
    onChange(newSelected);

  };

  /**
   * Determines if an option is considered checked.
   */
  const isEnabled = (optionId: string) => {
    return selected.includes('' + optionId) || selected.includes(parseInt(optionId));
  };

  // If disabled is not an array, treat it as a boolean disabling the entire field.
  const allDisabled = disabled && !Array.isArray(disabled) ? disabled : false;

  if (Object.keys(options).length === 0) {
    return <>{__('No options found', 'burst-statistics')}</>;
  }

  return (
    <div className="flex flex-col space-y-2">
      {Object.entries(options).map(([key, optionLabel], i) => (
        <div
          key={key}
          className="flex items-center"
        >
          <Checkbox.Root
            className="w-4 h-4 border border-gray-400 rounded flex-shrink-0 disabled:opacity-50"
            id={`${id}_${key}`}
            checked={isEnabled(key)}
            aria-label={label}
            disabled={
              allDisabled ||
              (Array.isArray(disabled) && (disabled as string[]).includes(key))
            }
            required={required}
            onCheckedChange={(checked) => handleCheckboxChange(!!checked, key)}
          >
            <Checkbox.Indicator className="flex items-center justify-center">
            <Icon
                      name="check"
                      size={14}
                      color="blue"
                      strokeWidth={3} 
                      tooltip=""
                      onClick={() => {}}
                      className=""
                    />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label className="ml-2" htmlFor={`${id}_${key}`}>
            {optionLabel}{field.action}
          </label>
        </div>
      ))}
    </div>
  );
};

export default memo(CheckboxGroupInput); 