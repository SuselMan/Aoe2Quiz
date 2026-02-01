import React from "react";
import { Text, Image, StyleSheet, View } from "react-native";
import CommonButton from "@/app/components/ui/CommonButton";

type AnswerButtonProps = {
    imageUrl: string | undefined;
    text: string;
    onPress: () => void;
    reveal: boolean;
    isCorrect: boolean;
    style?: any,
};

const AnswerButton: React.FC<AnswerButtonProps> = ({ imageUrl, text, onPress, reveal, isCorrect, style }) => {
    return (
        <CommonButton isCorrect={isCorrect} onPress={onPress} reveal={reveal} style={style}>
            <View style={styles.container}>
                {
                    !!imageUrl && (<Image source={{ uri: imageUrl }} style={styles.image} />)
                }
                <Text style={styles.text} numberOfLines={2} ellipsizeMode={"clip"}>{text}</Text>
            </View>
        </CommonButton>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        maxWidth: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    image: {
        width: 32,
        height: 32,
        marginRight: 4,
        borderRadius: 5,
        flexGrow: 0,
    },
    text: {
        textAlign: "center",
        color: "#FFF",
        fontSize: 14,
        fontWeight: "bold",
    },
});

export default AnswerButton;
