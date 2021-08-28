import React, {useLayoutEffect, useEffect, useState} from 'react'
import { FlatList, SafeAreaView } from 'react-native'
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import Constants from 'expo-constants';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomListItem from '../components/CustomListItem';
import ContactListItem from '../components/ContactsListItem';
import { auth, db} from '../firebase';
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons';
import * as ErrorRecovery from 'expo-error-recovery';
import * as Contacts from 'expo-contacts';
import { Platform } from 'react-native';

const HomeScreen = ({navigation}) => {

    //const [chats, setChats] = useState([]);
    const [index, setIndex] = useState(0);
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [isLoadingContacts, setIsLoadingContacts] = useState(true);
    const [isLoadingContactsContainer, setIsLoadingContactsContainers] = useState(true);
    const [PChats, setPChats] = useState([false]);

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login');
        });
    }


    /*useEffect(()=>{
        const unSubscribe = db.collection('chats').onSnapshot(snapshot => (
            setChats(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            })))
        ))

        return unSubscribe;
    }, []);*/

    /*The Query
    const q = db.collection('PChats').where('participants', 'array-contains', auth.currentUser.email);

    useEffect(()=>{
        const unSubscribe = q.limit(2).onSnapshot(snapshot => (
            setPChats(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
                photoURL: 'http://simpleicon.com/wp-content/uploads/user1.png'
            })))
        ));
        setIsLoadingChats(false);
        return unSubscribe;
    }, []);*/

    useEffect(()=>{
        setIsLoadingChats(true);
        setIsLoading(true);
        const unSubscribe = db.collection('PChats').where('participants', 'array-contains', auth.currentUser.email).onSnapshot(snapshot => (
            setPChats(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
                photoURL: 'http://simpleicon.com/wp-content/uploads/user1.png'
            }))),
            setIsLoading(false),
            setIsLoadingChats(false)
        ));
        
        return unSubscribe;
    }, []);

    const onRefresh = React.useCallback(() => {
        setIsLoadingChats(true);
        setIsLoading(true);
        const unSubscribe = db.collection('PChats').where('participants', 'array-contains', auth.currentUser.email).onSnapshot(snapshot => (
            setPChats(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
                photoURL: 'http://simpleicon.com/wp-content/uploads/user1.png'
            })))
        ));
        setIsLoading(false);
        setIsLoadingChats(false);
        return unSubscribe;
      }, []);

    /*
    Gets it once
    useEffect(()=>{
        const unSubscribe = db.collection('PChats').where('participants', 'array-contains', auth.currentUser.email).get().then(snapshot => (
            setPChats(snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
                photoURL: 'http://simpleicon.com/wp-content/uploads/user1.png'
            })))
        ));
        setIsLoadingChats(false);
        return unSubscribe;
    }, []);*/

    useLayoutEffect(() => {

        //Turn on loading
        navigation.setOptions({
            tabBarVisible: false,
        });

        //do stuff
        navigation.setOptions({
            title: auth?.currentUser?.displayName,
            headerStyle: {backgroundColor: '#dd0b92'},
            headerTitleStyle: {color: "#fff"},
            headerTintColor: "#fff",
            headerLeft: () => <View style={{marginLeft: 10, marginRight: 10}}>
                <TouchableOpacity activeOpacity={.5} onPress={signOutUser}>
                    <Avatar rounded source={{uri: auth?.currentUser?.photoURL}}/>
                </TouchableOpacity>
            </View>,
            headerRight: () => 
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity activeOpacity={.5}>
                    <AntDesign name="camerao" size={24} color="white" style={{marginRight: 15}} onPress={() => navigation.navigate("ChangePFP")}></AntDesign>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.5} onPress={() => navigation.navigate("AddChat")}>
                    <SimpleLineIcons name="pencil" size={24} color="white" style={{marginRight: 10}}></SimpleLineIcons>
                </TouchableOpacity>
            </View>
        });
        //then turn off loading
        navigation.setOptions({
            tabBarVisible: false
        });
        setIsLoading(false);
    }, [navigation])

    const enterChat = (id, chatName, photoURL) => {
        navigation.navigate('Chat', {
            id,
            chatName,
            photoURL
        });
    }
    function HomeScreen2() {
        return (
            <SafeAreaView>
                { isLoading ? (
                    <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="#dd0b92"/>
                    </View>
                ) :(
                <ScrollView refreshControl={<RefreshControl refreshing={isLoadingChats} onRefresh={onRefresh} />} style={styles.container}>
                    {/*chats.map(({id, data: {chatName} }) => (
                        <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
                    ))*/}
                    {
                    isLoadingChats ? (
                        <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
                            <ActivityIndicator size="large" color="#dd0b92"/>
                        </View>
                    ) :
                    !PChats[0] ? (
                        <View style={{height: '100%', width: '100%', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden'}}>
                            <Text style={{color: '#565555', fontSize: 24, fontWeight: '600'}}>No Chats</Text>
                        </View>
                        
                    ) : 
                    PChats.map(({id, data: {participants}, photoURL}) => (
                        <CustomListItem key={id} id={id} chatName={participants} photoURL={photoURL} enterChat={enterChat} /> 
                    ))}
                </ScrollView>
                )}
            </SafeAreaView>
        );
      }

      //Get contacts from users phone
      useEffect(() => {
        (async () => {
          const { status } = await Contacts.requestPermissionsAsync();
          if (status === 'granted') {
            
            if(Platform.OS === 'ios'){
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Emails],
                  });
                  if (data.length > 0) {
                    setContacts(data);
                    setIsLoadingContacts(false);
                    setIsLoadingContactsContainers(false);

                  }
            }else if(Platform.OS === 'android'){
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Emails, Contacts.Fields.ImageAvailable ? (Contacts.Fields.Image) : false, Contacts.Fields.emails ? (Contacts.Fields.Email) : false],
                  });
                  if (data.length > 0) {
                    setContacts(data);
                    setIsLoadingContacts(false);
                    setIsLoadingContactsContainers(false);
                  }
            }else{
                setIsLoadingContacts(false);
                setIsLoadingContactsContainers(false);
            }
            
          }
        })();
      }, []);

      const onRefreshContacts = React.useCallback(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
              
              if(Platform.OS === 'ios'){
                  const { data } = await Contacts.getContactsAsync({
                      fields: [Contacts.Fields.Emails],
                    });
                    if (data.length > 0) {
                      setContacts(data);
                      setIsLoadingContacts(false);
                      setIsLoadingContactsContainers(false);
  
                    }
              }else if(Platform.OS === 'android'){
                  const { data } = await Contacts.getContactsAsync({
                      fields: [Contacts.Fields.Emails, Contacts.Fields.ImageAvailable ? (Contacts.Fields.Image) : false, Contacts.Fields.emails ? (Contacts.Fields.Email) : false],
                    });
                    if (data.length > 0) {
                      setContacts(data);
                      setIsLoadingContacts(false);
                      setIsLoadingContactsContainers(false);
                    }
              }else{
                  setIsLoadingContacts(false);
                  setIsLoadingContactsContainers(false);
              }
              
            }
          })();
      }, []);

      const createChat = async (id, name, photoURL, email) => {
        //Edit this
        console.log(email);
        if(email){
            let data = false;
            setIsLoadingContacts(true);
            await db.collection('PChats').where('combine', '==', auth.currentUser.email+email).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    //data.push(doc.id, " => ", doc.data());
                    //console.log((doc.id, " => ", doc.data()))
                    data = doc.data().combine;
                });
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });
            console.log('1 query')
            if(!data){
                await db.collection('PChats').where('combine', '==', email+auth.currentUser.email).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        //data.push(doc.id, " => ", doc.data());
                        //console.log((doc.id, " => ", doc.data()))
                        data = doc.data().combine;
                    });
                }).catch((error) => {
                    console.log("Error getting documents: ", error);
                });
                console.log('2 query')
                if(!data){
                    alert("One moment please, we are creating the chat");
                    await db.collection('PChats').add({
                            participants: [
                                auth.currentUser.email, 
                                email
                            ],
                            combine: auth.currentUser.email + email
                    }).then(()=>{
                            console.log("hi");
                            setIsLoadingContacts(false);
                            navigation.navigate('Chats');
                    }).catch((error) => {alert(error)});
                }else{
                    alert("Chat Already exists!");
                    setIsLoadingContacts(false);
                }
            }else{
                alert("Chat Already exists!");
                setIsLoadingContacts(false);
            }
            
        }else{
            alert('Contact doesnt have an email.');
            setIsLoadingContacts(false);
        }
    }
      
      function ContactsScreen() {
        return (
            <SafeAreaView>
                
            { isLoadingContactsContainer ? (
                <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#dd0b92"/>
                </View>
            ) :(
            <ScrollView refreshControl={<RefreshControl refreshing={isLoadingContacts} onRefresh={onRefreshContacts} />} style={styles.container}>
                {
                isLoadingContacts ? (
                    <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="#dd0b92"/>
                    </View>
                ) :
                !contacts[0].id ? (
                    <View style={{height: '100%', width: '100%', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden'}}>
                        <Text style={{color: '#565555', fontSize: 24, fontWeight: '600'}}>No Contacts</Text>
                    </View>
                    
                ) : 
                contacts.map((contact, index) => (
                    <View key={index}>
                        {/*console.log(contact.emails ? (contact.emails[0].email) : '')*/}
                        <ContactListItem key={index} id={index} name={contact.name ? (contact.name) : ('not a Name')} photoURL={contact.imageAvailable ? (contact.image.uri) : ('https://jmcp.edu.pk/wp-content/uploads/2020/10/blank-profile-picture-973460_1280-300x300-1.jpg')} email={contact.emails ? (contact.emails[0].email) : false} createChat={createChat}/>
                    </View>
                ))}
            </ScrollView>
            )}
        </SafeAreaView>
        );
      }
      
      const Tab = createMaterialTopTabNavigator();

    return (
            <Tab.Navigator>
                <Tab.Screen name="Chats" component={HomeScreen2} />
                <Tab.Screen name="Contacts" component={ContactsScreen} />
            </Tab.Navigator>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        height: '100%'
    }
})
