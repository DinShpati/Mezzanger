import React, {useEffect, useState} from 'react'
import { KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'react-native';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { auth } from '../firebase';
import logo from '../assets/logo.png';
import { LinearGradient } from 'expo-linear-gradient';


const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        setIsLoading(true);
        const unsubscribed = auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                setIsLoading(false);
                navigation.replace('Home');
            }
            setIsLoading(false);
        });

        return unsubscribed;
    }, []);

    const signIn = () => {
        setIsLoading(true);
        auth.signInWithEmailAndPassword(email, password).catch(error => {
            alert(error)
            setIsLoading(false);
        });
    }

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            {isLoading ? (<View style={{width: '100%', height: '100%', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#dd0b92"/>
                </View>) : (<>
            <StatusBar style="light" />
            <Image source={{
                uri: 'http://simpleicon.com/wp-content/uploads/user1.png'
            }} 
            style={{width: 200, height: 200}}/>
            <View style={styles.inputContainer}>
                <Input placeholder="Email" autoFocus type="email" value={email} onChangeText={(text) => setEmail(text)}/>
                <Input placeholder="Password" secureTextEntry type="password" value={password} onChangeText={(text) => setPassword(text)} onSubmitEditing={signIn}/>
                <Button containerStyle={styles.button1} onPress={signIn} title="Login" color='#000'/>
                <Button containerStyle={styles.button} onPress={()=>{navigation.navigate("Register")}} type="outline" title="Register"/>
                <View style={{height: 100}}></View>
            </View>
            </>)}
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    inputContainer:{
        width: 300
    },
    button:{
        width: 200,
        marginTop: 10
    },
    button1:{
        width: 200,
        marginTop: 10,
        backgroundColor: 'transparent'
    }
})
