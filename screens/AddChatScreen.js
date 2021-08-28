import React, {useLayoutEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, auth } from '../firebase';
import firebase from 'firebase';


const AddChatScreen = ({navigation}) => {

    const [input, setInput] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add a new chat',
            headerStyle: {backgroundColor: 'white'},
            headerTitleStyle: {color: "black"},
            headerTintColor: "black",
            headerBackTitle: 'Chats'

        });
    }, [navigation])

    const createChat = async () => {
        // await db.collection('chats').add({
        //     chatName: input,
        // }).then(()=>{
        //     navigation.goBack();
        // }).catch((error) => {alert(error)});




        //Edit this
        await db.collection('PChats').add({
            participants: [
                auth.currentUser.email, 
                input
            ]
        }).then(()=>{
            navigation.goBack();
        }).catch((error) => {alert(error)});

    }

    return (
        <View style={styles.container}>
            <Input
            placeholder="Enter user email"
            value={input}
            onChangeText={(text) => setInput(text)}
            onSubmitEditing={createChat}
            leftIcon={
                <Icon name="wechat" type="antdesign" size={24} color="black" />
            }/>
            <Button disabled={!input} onPress={createChat} title="Create new chat"/>
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding: 30,
        height: '100%'
    }
});
