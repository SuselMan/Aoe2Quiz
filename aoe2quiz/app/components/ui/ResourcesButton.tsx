import React from "react";
import {TouchableOpacity, Text, Image, StyleSheet, View} from "react-native";
import {Cost} from "@/app/models/dataModel";
import CommonButton from "@/app/components/ui/CommonButton";

type AnswerButtonProps = {
    cost?: Cost,
    onPress: () => void;
    reveal: boolean;
    isCorrect: boolean;
    style?: any,
};

const ResourcesButton: React.FC<AnswerButtonProps> = ({ cost, onPress, isCorrect, reveal, style }) => {

    const [isRevealed, setIsRevealed] = React.useState(false);

    const onButtonPress = () => {
        setIsRevealed(true);
        onPress();
    }

    return (
        <CommonButton isCorrect={isCorrect} onPress={onPress} reveal={reveal} style={style}>
            <View style={styles.container}>
                {
                    !!cost?.Wood && (
                        <View style={styles.item}>
                            <Image source={{ uri: 'https://aoe2techtree.net/img/wood.png' }} style={styles.image} />
                            <Text style={styles.text} numberOfLines={2} ellipsizeMode={'tail'}>{cost?.Wood}</Text>
                        </View>
                    )
                }

                {
                    !!cost?.Gold && (
                        <View style={styles.item}>
                            <Image source={{ uri: 'https://aoe2techtree.net/img/gold.png' }} style={styles.image} />
                            <Text style={styles.text}>{cost?.Gold}</Text>
                        </View>
                    )
                }

                {
                    !!cost?.Stone && (
                        <View style={styles.item}>
                            <Image source={{ uri: 'https://aoe2techtree.net/img/stone.png' }} style={styles.image} />
                            <Text style={styles.text}>{cost?.Stone}</Text>
                        </View>
                    )
                }

                {
                    !!cost?.Food && (
                        <View style={styles.item}>
                            <Image source={{ uri: 'https://aoe2techtree.net/img/food.png' }} style={styles.image} />
                            <Text style={styles.text}>{cost?.Food}</Text>
                        </View>
                    )
                }
            </View>
        </CommonButton>
    );
};

const styles = StyleSheet.create({
    item: {
        display: 'flex',
        flexDirection: 'row',
        margin: 2,
        maxWidth: '100%'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '100%',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    image: {
        width: 18,
        marginRight: 3,
        borderRadius: 0,
    },
    text: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ResourcesButton;
