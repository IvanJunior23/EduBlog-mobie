export interface ISelectOption {
  label: string;
  value: string;
}

export interface ISelectFieldProps {
  label: string;
  value: string;
  options: ISelectOption[];
  placeholder: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
}
