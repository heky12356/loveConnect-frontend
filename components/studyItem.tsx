import { Dimensions, Pressable, StyleSheet, Text } from 'react-native'

const {width, height} = Dimensions.get('window')

type Prop = {
    label: string,
    onPress: () => void,
}
export default function StudyItem({
  label,
  onPress,
}: Prop) {
  return (
    <Pressable
            style={styles.categoryButton}
            onPress={onPress}
          >
            <Text style={styles.categoryText}>{label}</Text>
          </Pressable>
  )
}

const styles = StyleSheet.create({
  categoryButton: {
    backgroundColor: '#FFDEE2',
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.05,
    boxShadow: '0 8px 0 -4px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.15)',
  },
  categoryText: {
    fontSize: width * 0.06,
    color: 'black',
    lineHeight: width * 0.4,
  },
})
