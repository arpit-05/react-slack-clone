import React from 'react';
import {Segment,Comment} from 'semantic-ui-react'
import MessageForm from './MessageForm';
import MessagesHeader from './MessagesHeader';

import firebase from '../firebase'
import Message from './Message';
 
class Messages extends React.Component{
    state={
        
        privateMessagesRef:firebase.database().ref('privateMessages'),
        privateChannel:this.props.isPrivateChannel,
        messagesRef:firebase.database().ref('messages'),
        channel:this.props.currentChannel,
        user:this.props.currentUser,
        messages:[],
        messagesLoading:'',
        progreesBar:false,
        numUniqueUsers:'',
        searchTerm:'',
        searchLoading:false,
        searchResults:[]
    }  
    componentDidMount(){
        const {channel,user}=this.state
        if(channel && user)
        {
            this.addListeners(channel.id)
        }
    }
    addListeners=(channelId)=>{
        let loadedMessages=[];
        const ref=this.getMessagesRef()
        ref.child(channelId).on('child_added',snap=>{
            loadedMessages.push(snap.val())
            this.setState({messages:loadedMessages,messagesLoading:false})
            this.countUniqueUsers(loadedMessages)
        })
    }
    countUniqueUsers=messages=>{
        const uniqueUsers=messages.reduce((acc,message)=>{
            if(!acc.includes(message.user.name)){
                acc.push(message.user.name)
            }
            return acc;
        },[])
        const plural=uniqueUsers.length>1 || uniqueUsers.length===0
         const numUniqueUsers=`${uniqueUsers.length} user${plural? 's':''}`
         this.setState({numUniqueUsers})
    }
    handleSearchMessages=()=>{
        const channelMessages=[...this.state.messages]
        const regex=new RegExp(this.state.searchTerm,'gi')
        const searchResults=channelMessages.reduce((acc,message)=>{
            if((message.content && message.content.match(regex)) || (message.user.name.match(regex))){
                acc.push(message)
            }
            return acc;
        },[])
        this.setState({searchResults})
       setTimeout(()=>this.setState({searchLoading:false}),1000)  
    }
    handleSearchChange=(event)=>{
        this.setState({searchTerm:event.target.value,
        searchLoading:true},()=>this.handleSearchMessages())
    }
    displayMessgaes=messages=>(
        
        messages.length>0 && messages.map(message=>(
            
            <Message key={message.timestamp}
                     message={message}
                     user={this.state.user}
                     />
                    
        ) )
    )
    isProgressBarVisible=(percent)=>{
        if(percent>0){
            this.setState({progreesBar:true})
        }
    }
    displayChannel=channel=>{
        return channel?`${this.state.privateChannel ? '@' : '#'}${channel.name}`:""
    }
    getMessagesRef=()=>{
        const {messagesRef,privateMessagesRef,privateChannel} =this.state
        return privateChannel ? privateMessagesRef:messagesRef
    }
    render(){
        const {messagesRef,channel,user,searchLoading,messages,progreesBar,numUniqueUsers,searchResults,searchTerm,privateChannel}=this.state
        return(
            <React.Fragment>
            <MessagesHeader channelName={this.displayChannel(channel)} 
                            numUniqueUsers={numUniqueUsers} 
                            handleSearchChange={this.handleSearchChange}
                            searchLoading={searchLoading}
                            isPrivateChannel={privateChannel}
                            />
            <Segment>
                <Comment.Group className={progreesBar?'messages__progress':'messages'}>
                     
                      {searchTerm?this.displayMessgaes(searchResults) : this.displayMessgaes(messages)}
                      
                      {/* {messages.length>0 && messages.map(message=>(
            
            <Message key={message.timestamp}
                     message={message}
                     user={this.state.user}
                     />
                    
        ) )} */}
                      
                </Comment.Group>
            </Segment>
            <MessageForm messagesRef={messagesRef}
                          currentChannel={channel}
                          currentUser={user}
                          isProgressBarVisible={this.isProgressBarVisible}
                          isPrivateChannel={privateChannel}
                          getMessagesRef={this.getMessagesRef}/>
            </React.Fragment>
        )
    }
}
export default Messages;