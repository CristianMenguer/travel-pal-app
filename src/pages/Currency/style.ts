import { StyleSheet } from 'react-native'

// This is the style file to the currency page

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F4',
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    input: {
        width: 200,
        maxWidth: '80%',
        height: 60,
        borderRadius: 10,
        borderWidth: 2,
        backgroundColor: '#FFF',
        borderColor: '#232129',
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    logo: {
        width: 200,
        height: 200
    },
    text: {
        marginVertical: 8,
    },
    textLocation: {
        marginVertical: 16,
        fontSize: 24
    }
})

export default Styles
