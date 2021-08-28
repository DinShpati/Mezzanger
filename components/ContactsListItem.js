import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { db, auth } from '../firebase';
import firebase from 'firebase';

const ContactListItem = ({id, name, photoURL, email, createChat}) => {

    

    return (
        <ListItem onPress={() => createChat(id, name, photoURL, email)} key={id} bottomDivider>
            <Avatar rounded
            source={{
                uri: photoURL
            }}/>
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "700"}}>{name}</ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">{name}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default ContactListItem

const styles = StyleSheet.create({})
