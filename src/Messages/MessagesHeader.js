import React from 'react';
import {Header,Segment,Input,Icon} from "semantic-ui-react"
class MessagesHeader extends React.Component{
    render()
    {
        const{channelName,numUniqueUsers,handleSearchChange,searchLoading,isPrivateChannel}=this.props
        return(<Segment clearing>
            <Header fluid='true' as='h2' floated='left' style={{marginBottom:0}}>
                <span>
                    {channelName}
                    {!isPrivateChannel && <Icon name={'star outline'} color='black'></Icon> }
                    
                </span>
                <Header.Subheader>{numUniqueUsers}</Header.Subheader>
            </Header>
            {/*Message Search Input*/}
            <Header floated='right'>
            <Input size='mini'
            loading={searchLoading}
            onChange={handleSearchChange}
            icon='search'
            name='searchTerm'
            placeholder="Search Messages"/>
            </Header>

        </Segment>)
    }
}
export default MessagesHeader