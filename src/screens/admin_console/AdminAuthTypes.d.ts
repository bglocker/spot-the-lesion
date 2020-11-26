interface SettingType {
  name: string;
  state: number;
  changer: (number) => void;
}

interface PasswordType {
  value: string;
  showPassword: boolean;
  displayError: boolean;
}
