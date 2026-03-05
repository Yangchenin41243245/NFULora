import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type TabParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
};

export type Screen1Props = BottomTabScreenProps<TabParamList, 'Screen1'>;
export type Screen2Props = BottomTabScreenProps<TabParamList, 'Screen2'>;
export type Screen3Props = BottomTabScreenProps<TabParamList, 'Screen3'>;