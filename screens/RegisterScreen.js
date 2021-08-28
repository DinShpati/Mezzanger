import React, {useLayoutEffect, useState} from 'react'
import { StatusBar } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { auth } from '../firebase';


const RegisterScreen = ({navigation}) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPasword] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Login'
        });
    }, [navigation]);

    const register = () => {
        auth.createUserWithEmailAndPassword(email, password).then(authUser => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: imageUrl || 'https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png',
            })
        }).catch(error => {
            alert(error.message);
        })
    };

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <StatusBar style="light"></StatusBar>
            <Text h3 style={{marginBottom: 50, marginTop: 20}}>
                Create A Signal account
            </Text>
            <View style={styles.inputContainer}>
                <Input placeholder="Full Name"
                autoFocus
                type='text'
                value={name}
                onChangeText={text => setName(text)}/>

                <Input placeholder="Email"
                type='email'
                onChangeText={text => setEmail(text)}
                value={email}/>

                <Input placeholder="Password"
                type='password'
                onChangeText={text => setPasword(text)}
                value={password}/>

                <Input placeholder="Profile Picture URL (Optional)"
                type='text'
                value={imageUrl}
                onChangeText={text => setImageUrl(text)}
                onSubmitEditing={register}/>

            </View>

            <Button style={styles.button} raised onPress={register} title="Register"/>

            <View style={{height: 100}}></View>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    button:{
        width: 200,
        marginTop: 10
    },
    inputContainer:{
        width: 300,
    },
})
