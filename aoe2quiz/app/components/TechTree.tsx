import React, {useMemo} from "react";
import {View, Text, Image, StyleSheet, FlatList} from "react-native";
import {
    Buildings,
    TechTreeBrunch,
    TechTreePoint,
    TreeAgeData
} from "@/app/const/techTree";
import {
    getImageByAgeId,
    hasPoint,
    getImageUrl,
    getTitle,
} from "@/app/utils/helpers";

const TechTreePointComponent: React.FC<{ data: TechTreePoint, civId: string }> = ({data, civId}) => {
    let backgroundColor = data.unit ? "#4285F4" : "#34A853"; // Синий для юнитов, зеленый для технологий
    if (data.isUniq) {
        backgroundColor = 'rgba(86,49,143,0.73)';
    }
    if (data.building) {
        backgroundColor = '#8c3f3f';
    }

    let hasThis = useMemo(() => {
        return hasPoint(data, civId);
    }, [civId])

    const isEmpty = !data.tech && !data.building && !data.unit;

    return (
        <View style={[styles.pointContainer, {backgroundColor, opacity: isEmpty ? 0 : 1}]}>
            <Image source={{uri: getImageUrl(data)}} style={styles.image}/>
            {!hasThis && (
                <Image source={{uri: 'https://aoe2techtree.net/img/cross.png'}} style={styles.cross}/>
            )}
            <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">{getTitle(data)}</Text>
        </View>
    );
};

const TreeAgeComponent: React.FC<{ data: TreeAgeData, index: number, civId: string }> = ({data, index, civId}) => {
    const ageImg = getImageByAgeId(data.age);
    return (
        <View style={[styles.ageContainer, index % 2 === 0 && styles.second]}>
            <Image
                source={{uri: ageImg}}
                style={{
                    width: 24,
                    height: 24,
                }}
            />
            {data.items.map((line, lineIndex) => (
                <View key={lineIndex} style={styles.line}>
                    {line.map((point, pointIndex) => (
                        <TechTreePointComponent key={pointIndex} data={point} civId={civId}/>
                    ))}
                </View>
            ))}
        </View>
    );
};

const TechTreeBranch: React.FC<{ data: TechTreeBrunch, civId: string, type: Buildings }> = ({data, civId, type}) => {
    return (
        <View style={styles.container}>
            <TechTreePointComponent data={{building: type}} civId={civId}/>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => <TreeAgeComponent civId={civId} data={item} index={index}/>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cross: {
        width: 40,
        height: 40,
        position: 'absolute',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    second: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    ageContainer: {
        alignItems: "flex-start",
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 1,
        paddingRight: 1,
    },
    line: {
        flexDirection: "column",
        justifyContent: "center",
        marginVertical: 1,
    },
    pointContainer: {
        width: 42,
        height: 70,
        alignItems: "center",
        justifyContent: "flex-start",
        display: "flex",
        flexDirection: 'column',
        marginHorizontal: 2,
        borderRadius: 5,
        marginBottom: 4,
        overflow: 'hidden',
    },
    image: {
        width: 42,
        height: 40,
    },
    text: {
        fontSize: 9,
        lineHeight: 11,
        color: "white",
        textAlign: "center",
        marginTop: 2,
    },
});

export default TechTreeBranch;
