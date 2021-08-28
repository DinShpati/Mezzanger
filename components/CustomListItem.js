import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import {auth, db} from '../firebase';

const CustomListItem = ({id, chatName, photoURL,enterChat}) => {

    const [chatMessages, setChatMessages] = useState('');

    useEffect(() => {
        const unSubscribe = db
        .collection('PChats')
        .doc(id)
        .collection('message')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) =>( 
            setChatMessages(snapshot.docs.map((doc) => doc.data()))
        ));

        return unSubscribe;
    }, []);

    return (
        <ListItem onPress={() => enterChat(id, chatName, photoURL)} key={id} bottomDivider>
            <Avatar rounded
            source={{
                uri: chatMessages?.[0]?.photoURL || photoURL
            }}/>
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "700"}}>{chatName[0] === auth.currentUser.email ? chatName[1] : chatName[0]}</ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">{chatMessages?.[0]?.displayName} : {chatMessages?.[0]?.message}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({})
