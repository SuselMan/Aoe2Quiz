import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet, ImageBackground, View } from "react-native";
import { playButtonSound } from "@/src/utils/sounds";

type CommonButtonProps = {
    imageUrl?: string;
    text?: string;
    onPress: () => void;
    reveal: boolean;
    isCorrect: boolean;
    children?: React.ReactNode; // Позволяет передавать контент внутрь кнопки
    style?: any
};

const CommonButton: React.FC<CommonButtonProps> = ({ imageUrl, text, onPress, reveal, isCorrect, style, children }) => {
    const [isRevealed, setIsRevealed] = React.useState(false);

    const onButtonPress = () => {
        playButtonSound();
        setIsRevealed(true);
        onPress();
    };

    return (
        <TouchableOpacity
            style={[styles.button, ((isRevealed || reveal) && !isCorrect) && styles.error, (reveal && isCorrect) && styles.correct, style]}
            onPress={onButtonPress}
            activeOpacity={0.7}
        >
            {children ? children : <Text style={styles.text}>{text}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    childrenContainer: {
    },
    error: {
        backgroundColor: "#813838",
    },
    correct: {
        backgroundColor: "#667e2c",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        maxWidth: '100%',
        overflow: 'hidden',
        display: "flex",
        justifyContent: "center",
        borderColor: 'rgba(45,36,36,0.5)',
        backgroundColor: 'rgba(45,36,36,0.4)',
        borderWidth: 1,
        height: 72,
        margin: 1,
        padding: 8,
    },
    text: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CommonButton;
