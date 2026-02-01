import React, { useCallback } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { playButtonSound } from '@/app/utils/sounds';

/** Pressable that plays button sound on press. Use for all menu/action buttons. */
export default function SoundPressable(props: PressableProps) {
  const { onPress, ...rest } = props;
  const handlePress = useCallback(
    (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
      playButtonSound();
      onPress?.(e);
    },
    [onPress]
  );
  return <Pressable {...rest} onPress={handlePress} />;
}
