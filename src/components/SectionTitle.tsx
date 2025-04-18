import { Text } from 'react-native';

import { COLORS } from '~/constants/colors';

interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <Text className="mb-3 text-xl font-bold" style={{ color: COLORS.secondary }}>
    {title}
  </Text>
);

export default SectionTitle;
