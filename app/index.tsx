import { useFonts } from 'expo-font';
import { Text, ImageBackground, StyleSheet, View, Dimensions } from 'react-native';
import { letterText } from '../letterText';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function App() {
  const [fontsLoaded] = useFonts({
    'YourFont': require('../assets/fonts/DancingScript-VariableFont_wght.ttf'),
  });

  const [currentPage, setCurrentPage] = useState(0);
  const words = letterText.split(' ');
  const wordsPerPage = 50; // Her sayfada gösterilecek kelime sayısı
  const totalPages = Math.ceil(words.length / wordsPerPage);

  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationX < -width / 2 && currentPage < totalPages - 1) {
      translateX.value = withSpring(-width);
      setCurrentPage(currentPage + 1);
    } else if (event.nativeEvent.translationX > width / 2 && currentPage > 0) {
      translateX.value = withSpring(width);
      setCurrentPage(currentPage - 1);
    } else {
      translateX.value = withSpring(0);
    }
  };

  if (!fontsLoaded) {
    return null; // Font yüklenene kadar boş ekran gösterir
  }

  const getPageText = (page) => {
    const start = page * wordsPerPage;
    const end = start + wordsPerPage;
    return words.slice(start, end).join(' ');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <ImageBackground source={require('../assets/images/wallpaper.jpg')} style={styles.background}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{getPageText(currentPage)}</Text>
            </View>
          </ImageBackground>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arka planı biraz karartmak için
  },
  text: {
    fontFamily: 'YourFont',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
