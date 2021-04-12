import React from 'react';
import firebase from '../firebase'
import {connect} from 'react-redux'
import {setCurrentChannel,setPrivateChannel} from '../action/index'
import {Menu,Icon,Modal,Form,Input,Button,Label} from "semantic-ui-react"
class Channels extends React.Component{
    state={
        user:this.props.currentUser,
        channels:[],
        channel:null,
        modal:false,
        channelName:" ",
        channelDetails:" ",
        firstLoad:true,
        activeChannel:'',
        notifications:[],
        channelsRef:firebase.database().ref('channels'),
        messagesRef:firebase.database().ref('messages')
}
handleChange=(event)=>{
    this.setState({[event.target.name]:event.target.value})
}
closeModal=()=>{
    this.setState({
        modal:false
    })
}
openModal=()=>{
    this.setState({
        modal:true
    })
}
componentDidMount(){
    this.addListners();
}
componentWillUnmount(){
    this.removeListeners();
}
removeListeners=()=>{
    this.state.channelsRef.off();
}
addListners=()=>{
    let loadedChannels=[];
    this.state.channelsRef.on('child_added',snap=>{
        loadedChannels.push(snap.val());
        this.setState({channels:loadedChannels},()=>this.setFirstChannel())
        this.addNotificationListener(snap.key)
    })
}
addNotificationListener=channelId=>{
    this.state.messagesRef.child(channelId).on('value',snap=>{
        if(this.state.channel){
            this.handleNotification(channelId,this.state.channel.id,this.state.notifications,snap)
        }
    })
}
handleNotification=(channelId,currentChannelId,notifications,snap)=>{
    let lastTotal=0;
    let index=notifications.findIndex(notifications=>Notification.id===channelId)
    if(index!==-1){
        if(channelId!==currentChannelId){
            lastTotal=notifications[index].total
        }
        if(snap.numChildren()-lastTotal>0){
            notifications[index].count=snap.numChildren-lastTotal
        }
        notifications[index].lastKnownTotal=snap.numChildren();
    }else{
        notifications.push({
            id:channelId,
            total:snap.numChildren(),
            lastKnownTotal:snap.numChildren(),
            count:0
        })
        this.setState({notifications})
    }
}
setFirstChannel=()=>{
    const firstChannel=this.state.channels[0]
    if(this.state.firstLoad && this.state.channels.length>0)
    {
        this.props.setCurrentChannel(firstChannel)
        this.setActiveChannel(firstChannel)
    }
    this.setState({firstLoad:false})
}
addChannel=()=>{
    const{channelsRef,channelName,channelDetails,user} =this.state
    const key=channelsRef.push().key;
    const newChannel={
        id:key,
        name:channelName,
        details:channelDetails,
        createdBy:{
            name:user.displayName,
            avatar:user.photoURL
        }
    }
    channelsRef
    .child(key)
    .update(newChannel)
    .then(()=>{this.setState({channelName:'',channelDetails:''})
    this.closeModal();
    console.log("channel added")})

    .catch(err=>console.log(err)) 
}
clearNotification=()=>{
    let index=this.state.notifications.findIndex(notification=>notification.id===this.state.channel.id);
    if(index!==-1){
        let updatedNotifications=[...this.state.notifications]
        updatedNotifications[index].total=this.state.notifications[index].lastKnownTotal;
        updatedNotifications[index].count=0;
        this.setState({notifications:updatedNotifications})
    }
}
changeChannel=channel=>{
    this.setActiveChannel(channel)
    this.clearNotification();
    this.props.setCurrentChannel(channel)
    this.props.setPrivateChannel(false)
    this.setState({channel})
}
setActiveChannel=(channel)=>{
    this.setState({activeChannel:channel.id})
}
getNotificationCount=channel=>{
    let count=0;
    this.state.notifications.forEach(notification=>{
        if(notification.id===channel.id){
            count=notification.count;
        }
    })
    if(count>0) return count

}
handleSubmit=(event)=>{
    event.preventDefault();
    if(this.isFormValid)
    {
        this.addChannel();
    }   
}

isFormValid=()=>this.state.channelName&&this.state.channelDetails

    render(){
        const {channels,modal} =this.state
        return(
            <React.Fragment>
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='exchange'/>CHANNELS
                    </span>{' '}
                    ({channels.length}) <Icon name='add' onClick={this.openModal}/>
                </Menu.Item>
                
                {/*this.displayChannels(channels)*/}
                {
                    channels.length>0 && channels.map(channel=>(
      
                        <Menu.Item
                        key={channel.id }
                        onClick={()=>this.changeChannel(channel)}
                        name={channel.name}
                        style={{opacity:0.7}}
                        active={channel.id===this.state.activeChannel}
                        >
                            {this.getNotificationCount(channel) && (
                                <Label color='red'></Label>)}
                            #{channel.name}
                        </Menu.Item>
                      )
                          
                      )
                }
            </Menu.Menu>
            {/*Add Channel Modal*/}
            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                        <Input fluid
                        label="Name of Channel"
                        name="channelName"
                        onChange={this.handleChange}>
                        </Input>
                        </Form.Field>
                        <Form.Field>
                        <Input fluid
                        label="Channel Details"
                        name="channelDetails"
                        onChange={this.handleChange}>
                        </Input>
                        </Form.Field>
                    </Form>
                </Modal.Content>
            <Modal.Actions>
                <Button color='green' inverted onClick={this.handleSubmit}>
                    <Icon name='checkmark' /> Add
                </Button>
                <Button color='red' inverted onClick={this.closeModal}>
                    <Icon name='remove'/> Cancel
                </Button>
            </Modal.Actions>
            </Modal>
            </React.Fragment>
        )
    }
}
export default connect(null,{setCurrentChannel,setPrivateChannel})(Channels)