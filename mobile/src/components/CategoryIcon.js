import React from 'react';
import { Text } from 'react-native';
import { CATEGORY_ICONS } from '../utils/constants';

const CategoryIcon = ({ category }) => (
  <Text style={{ fontSize: 22 }}>{CATEGORY_ICONS[category] || '❓'}</Text>
);

export default CategoryIcon;
