interface SettingType {
  name: string;
  state: number;
  changer: (number) => void;
}