import React, {useLayoutEffect, useState} from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Button, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, auth } from '../firebase';
import firebase from 'firebase';


const ChangePFP = ({navigation}) => {

    const [input, setInput] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Change your profile picture',
            headerStyle: {backgroundColor: 'white'},
            headerTitleStyle: {color: "black"},
            headerTintColor: "black",
            headerBackTitle: 'Chats'

        });
    }, [navigation])

    var isUriImage = function(uri) {
        //make sure we remove any nasty GET params 
        uri = uri.split('?')[0];
        //moving on, split the uri into parts that had dots before them
        var parts = uri.split('.');
        //get the last part ( should be the extension )
        var extension = parts[parts.length-1];
        //define some image types to test against
        var imageTypes = ['jpg','jpeg','tiff','png','gif','bmp'];
        //check if the extension matches anything in the list.
        if(imageTypes.indexOf(extension) !== -1) {
            return true;   
        }
    }

    const updatePFP = async () => {
        if(isUriImage(input)){
            auth.currentUser.updateProfile({photoURL: input})
            .then(function() { 
                Alert.alert(
                    'New Profile Picture',
                    'Prodile has successfully been updated!',
                    [
                      { text: 'OK', onPress: () => {
                          navigation.navigate('Home');
                      } }
                    ],
                    { cancelable: false }
                  );
             })
            .catch(function(error) { console.log(error) });

        }else{
            Alert.alert(
                'Invalid URL',
                'The URL Provided is not a valid image',
                [
                  { text: 'OK', onPress: () => {return} }
                ],
                { cancelable: false }
              );
        }
        

    }

    return (
        <View style={styles.container}>
            <Input
            placeholder="Enter picture URL"
            value={input}
            onChangeText={(text) => setInput(text)}
            onSubmitEditing={updatePFP}
            leftIcon={
                <Icon name="wechat" type="antdesign" size={24} color="black" />
            }/>
            <Button disabled={!input} onPress={updatePFP} title="Update Profile Picture"/>
        </View>
    )
}

export default ChangePFP

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding: 30,
        height: '100%'
    }
});
