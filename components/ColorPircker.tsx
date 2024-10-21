import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface IColorPicker extends LinearGradientProps {
  maxWidth: number;
  onColorChange?: (color: string | number) => void;
}

const ColorPicker: React.FC<IColorPicker> = ({
  colors,
  start,
  end,
  style,
  maxWidth,
  onColorChange,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const initialTranslateX = useSharedValue(0);

  const adjustedTranslateX = useDerivedValue(() => {
    return Math.min(Math.max(translateX.value, 0), maxWidth - CIRCLE_PICKER_SIZE);
  });

  const panGestureHandler = Gesture.Pan()
    .onStart(() => {
      initialTranslateX.value = adjustedTranslateX.value;

      translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
      scale.value = withSpring(1.2);
    })
    .onChange((event) => {
      translateX.value = event.translationX + initialTranslateX.value;
    })
    .onEnd(() => {
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    });

  const tapGestureHandler = Gesture.Tap()
    .onStart((event) => {
      translateY.value = withSpring(-CIRCLE_PICKER_SIZE);
      scale.value = withSpring(1.2);
      translateX.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE);
    })
    .onEnd(() => {
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
    });

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: adjustedTranslateX.value },
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const rInternalPickerStyle = useAnimatedStyle(() => {
    const inputRange = colors.map((_, index) => (index / colors.length) * maxWidth);

    const backgroundColor = interpolateColor(translateX.value, inputRange, colors);

    onColorChange?.(backgroundColor);

    return {
      backgroundColor: backgroundColor,
    };
  });

  const gesture = Gesture.Exclusive(panGestureHandler, tapGestureHandler);

  return (
    <GestureHandlerRootView>
      <Animated.View>
        <GestureDetector gesture={gesture}>
          <Animated.View style={styles.container}>
            <LinearGradient colors={colors} start={start} end={end} style={style} />
            <Animated.View style={[styles.pickerBorder]} />
            <Animated.View style={[styles.picker, reanimatedStyle]}>
              <Animated.View style={[styles.internalPicker, rInternalPickerStyle]} />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default ColorPicker;

const CIRCLE_PICKER_SIZE = 40;
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE / 2;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  pickerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },

  picker: {
    position: 'absolute',
    width: CIRCLE_PICKER_SIZE,
    height: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  internalPicker: {
    position: 'absolute',
    width: INTERNAL_PICKER_SIZE,
    height: INTERNAL_PICKER_SIZE,
    borderRadius: INTERNAL_PICKER_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
});
