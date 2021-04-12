import React from 'react';
import firebase from '../firebase'
import {Grid,Header,Icon,Dropdown,Image} from 'semantic-ui-react'
class UserPanel extends React.Component{
    state={
        user:this.props.currentUser
    }
    handleSignOut=()=>{
        firebase
        .auth()
        .signOut()
        .then(()=>console.log('signed out'))

    }

        dropdownOptions=()=>[
        {
    
            key:'user',
            text:(<span>Signed in as <strong>{this.state.user.displayName}</strong></span>),
            disabled:true
        },

        {
            key:'avatar',
            text:<span>Change Avatar</span>
            
        },

        {
            key:'signout',
            text:<span onClick={this.handleSignOut}>Sign Out</span>
        }
    ];
    render(){
        const {user}=this.state
        return(
            <Grid stylle={{background:'#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{padding:'1.2rem',margin:0}}>
                    {/*App header*/}
                    <Header inverted floated='left' as='h2'>
                        <Icon name='code'/>
                        <Header.Content>DevChat</Header.Content>
                    </Header>
                    </Grid.Row>
                    <Header style={{padding:'0.250em'}} as='h4' inverted>
                    <Dropdown trigger={
                        <span>
                    <Image src={user.photoURL} spaced='right' avatar></Image>
                    {user.displayName}
                      </span>
                      }
                    options={this.dropdownOptions()}
                    ></Dropdown>
                    </Header>
                </Grid.Column>

            </Grid>
        )
    }

}
export default  UserPanel;