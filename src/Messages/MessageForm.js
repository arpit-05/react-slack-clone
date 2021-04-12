import React from 'react';
import {Segment,Button,Input} from 'semantic-ui-react'
//import uuidv4  from 'uuid/v4';

import firebase from '../firebase'
import FileModal from './FileModal';
import { v4 as uuidv4 } from 'uuid';
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component{
    state={
        
        storageRef:firebase.storage().ref(),
        uploadState:'',
        uplaodTask:null,
        message:'',
        percentUploaded:0,
        loading:false,
        channel:this.props.currentChannel,
        user:this.props.currentUser,
        errors:[],
        modal:false
    }
    openModal=()=>{
        this.setState({modal:true})
    }
    closeModal=()=>{
        this.setState({modal:false})
    }
    handleChange=(event)=>{
        this.setState({[event.target.name]:event.target.value})
    }
    

    createMessage=(fileUrl=null)=>{
        const message={
            timestamp:firebase.database.ServerValue.TIMESTAMP,
            user :{
                id:this.state.user.uid,
                name:this.state.user.displayName,
                avatar:this.state.user.photoURL

            },
            
        }
        if(fileUrl!==null){
            message['image']=fileUrl
        }
        else{
            message['content']=this.state.message
        }
        return message
    }
   sendMessage=()=>{
       const {getMessagesRef}=this.props;
       const {message,channel}=this.state;
       if(message)
       {
        this.setState({loading:true})
        getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(()=>{
            this.setState({loading:false,message:'',errors:[]})
        })
        .catch(error=>{
            console.log(error)
            this.setState({loading:false, errors:this.state.errors.concat(error)})
        })
       }
       else {
           this.setState({
               errors:this.state.errors.concat({message:"Add a message"})
           })
       }

    }
 sendFileMessage=(fileUrl,ref,pathToUpload)=>{
     ref.child(pathToUpload)
     .push()
     .set(this.createMessage(fileUrl))
     .then(()=>{
         this.setState({uploadState:'done'})
     })
     .catch(err=>{
         console.error(err)
         this.setState({
             errors:this.state.errors.concat(err)
         })
     })

 }
 getPath=()=>{
     if(this.props.isPrivateChannel){
         return `chat/private-${this.state.channel.id}`
     }else{
         return `chatt/public`
     }
 }
    uploadFile=(file,metadata)=>{
        const pathToUpload=this.state.channel.id
        const ref=this.props.getMessagesRef
        const filePath=`${this.getPath()}/${uuidv4()}.jpg`;
        this.setState({
            uploadState:'uploading',
            uplaodTask:this.state.storageRef.child(filePath).put(file,metadata)
        },
        ()=>{
            this.state.uplaodTask.on('state_changed',snap=>{
                const percentUploaded=Math.round((snap.bytesTransferred/snap.totalBytes)*100)
                this.props.isProgressBarVisible(percentUploaded)
                this.setState({percentUploaded})
            },
            
            err=>{
                console.log(err)
                this.setState({
                    errors:this.state.errors.concat(err),
                    uploadState:'error',
                    uplaodTask:null

                })
            },
            ()=>{
                this.state.uplaodTask.snapshot.ref.getDownloadURL().then(downloadURL=>{
                    this.sendFileMessage(downloadURL,ref,pathToUpload)
                })
                .catch(err=>{
                    console.log(err)
                    this.setState({
                        errors:this.state.errors.concat(err),
                        uploadState:'error',
                        uplaodTask:null
                    })
                })
            }
            )
        }
        )
    }
    render(){
        const {errors,message,loading,modal,uploadState,percentUploaded}=this.state
        
        return(
            <Segment className='message__form'>
                <Input fluid
                name='message'
                style={{marginBottom:'0.7em'}}
                label={<Button icon={'add'}/>}
                labelPosition='left'
                value={message}
                className={errors.some(error=>error.message.includes('message')?'error':"")}
                onChange={this.handleChange}
                placeholder='Write your message'/>

                <Button.Group icon widths='2'>
                    <Button 
                    color='orange'
                    content='Add Reply'
                    labelPosition='left'
                    disabled={loading}
                    onClick={this.sendMessage}
                    icon='edit'/>
                    <Button color='teal'
                    onClick={this.openModal}
                    content="Upload Media"
                    labelPosition='right'
                    icon='cloud upload'/>
                    
                </Button.Group>
                <FileModal
                            modal={modal}
                            closeModal={this.closeModal}
                            uploadFile={this.uploadFile}/>
                <ProgressBar uploadState={uploadState}
                            percentUploaded={percentUploaded}
                />                            
            </Segment>
        )
    }
}
export default MessageForm