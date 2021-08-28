import React, {useLayoutEffect, useState, useRef} from 'react'
import { TouchableOpacity } from 'react-native'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { AntDesign, FontAwesome, Ionicons} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native';
import { Keyboard } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { auth, db } from '../firebase';
import firebase from 'firebase';
import { ActivityIndicator } from 'react-native';
import * as Crypto from 'expo-crypto';

const ChatScreen = ({ navigation, route}) => {

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerbackgroundVisible: false,
            headerTitle:() =>(
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar rounded source={{uri: messages?.[0]?.photoURL || route.params.photoURL}}/>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{color:'white', fontWeight: '700', marginLeft: 10}}>{route.params.chatName[0] === auth.currentUser.email ? route.params.chatName[1] : route.params.chatName[0]}</Text>
                </View>
            ),
            /*headerLeft:() => (
                <TouchableOpacity style={{marginLeft: 10}} onPress={navigation.goBack}>
                    <AntDesign name='arrowleft' size={24} color="white"/>
                </TouchableOpacity>
            ),*/
            headerRight: () => (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 90, marginRight: 20}}>
                    <TouchableOpacity>
                        <FontAwesome name='video-camera' size={24} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <FontAwesome name='phone' size={24} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteChat}>
                        <FontAwesome name='trash' size={24} color='white'/>
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation, messages])

    const sendMessage = () => {
        Keyboard.dismiss(); 
        
        db.collection('PChats').doc(route.params.id).collection('message').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        });

        setInput('');
    }

    const deleteChat = async () => {
        Alert.alert(
            'Delete Chat',
            'Are you sure you want to delete this chat?',
            [
              { text: 'Yes', onPress: () => {
                setDeleteLoading(true);
                //Edit this
                db.collection('PChats').doc(route.params.id).delete().then(()=>{
                    setDeleteLoading(false);
                    navigation.goBack();
                });
              }},
              {
                text: 'Cancel',
                onPress: () => {
                    return;
                },
                style: 'cancel',
              }
            ],
            { cancelable: false }
          );
        
    }

    useLayoutEffect(() => {
        const unSubcribe = db.collection('PChats').doc(route.params.id).collection('message')
        .orderBy('timestamp', 'desc').onSnapshot(snapshot => setMessages(snapshot.docs.map(doc => ({
            id:doc.id,
            data: doc.data()
        }))));

        return unSubcribe;
    }, [route]);

    return (
        <SafeAreaView style={{ flex:1, backgroundColor: 'white' }}>
            <StatusBar style="light" />
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? "padding": "height" || Platform.OS === 'android' ? "padding: 20" : "height"}
            style={styles.container}
            keyboardVerticalOffset={90}>
                {/* {<TouchableWithoutFeedback onPress={Keyboard.dismiss()} accessible={false}>} */}
                {deleteLoading ? (<View><ActivityIndicator size="large" color="#dd0b92"/></View>) : (
                <>
                
                    <ScrollView contentContainerStyle={{paddingTop: 15}}>
                        {messages.map(({id, data}) => (
                            data.email === auth.currentUser.email ?(
                                <View key={id} style={styles.reciever}>
                                    <Avatar rounded source={{uri: data.photoURL}} position='absolute' bottom={-15} right={-5}
                                    containerStyle={{position: 'absolute', bottom: -15, right: -5,}}/>
                                    <Text style={styles.recieverText}>{data.message}</Text>
                                </View>
                                ):(
                                <View key={id} style={styles.sender}>
                                    <Avatar rounded source={{uri: data.photoURL}} osition='absolute' bottom={-15} left={-5}
                                    containerStyle={{position: 'absolute', bottom: -15, left: -5,}}/>
                                    <Text style={styles.senderText}>{data.message}</Text>
                                    <Text style={styles.senderName}>{data.displayName}</Text>
                                </View>
                                )
                        ))}

                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput 
                        value={input}
                        placeholder="Send Message"
                        onChangeText={(text) => setInput(text)}
                        style={styles.textInput}/>
                        <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                            <Ionicons name="send" size={24} color="#2b68E6"/>
                        </TouchableOpacity>
                    </View>
                </>
                )}
                {/* {</TouchableWithoutFeedback>} */}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,

    },
    footer: {
        //marginTop: '80%',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15
    },
    textInput:{
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 40,
        backgroundColor: '#ECECEC',
        padding: 10,
        color: 'grey',
        borderRadius: 30
    },
    reciever:{
        padding: 15,
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative'
    },
    sender:{
        padding: 15,
        backgroundColor: '#2C6BED',
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        maxWidth: '80%',
        position: 'relative'
    },
    recieverText: {
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 10,
    },
    senderText: {
        color: 'white',
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15,
    },
    senderName:{
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: 'white'
    }
})
