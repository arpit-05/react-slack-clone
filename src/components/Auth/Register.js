import React from 'react';
import {Grid,Form,Segment,Button,Header,Icon,Message} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import firebase from '../../firebase'
class Register extends React.Component{
    state={
        username:'',
        email:'',
        password:'',
        passwordConfirmation:'',
        touched:{
            username:false,
            email:false,
            password:false,
            passwordConfirmation:false
        }

    }
    handleSubmit=(event)=>{
        event.preventDefault();
        
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email,this.state.password)
        .then(createdUser=>console.log(createdUser))
        .catch(error=>console.log(error))
    }



    handleBlur=(field)=>(evt)=>{
        this.setState({
            touched:{...this.state.touched,[field]:true}
        })
    }
handleChange=(event)=>{
   this.setState({[event.target.name]:event.target.value})
}
validate(username,email,password,passwordConfirmation)
    {
        const errors={
            username:'',
            email:'',
            password:'',
            passwordConfirmation:''
        }
        if(this.state.touched.username&&username.length<3)
        errors.username='User Name should be >=3 characters'
        else if(this.state.touched.username&&username.length>10)
        errors.username='First Name should be <=10 characters'
        if(this.state.touched.email&&email.split('').filter(x=>x==='@').length!==1)
        errors.email='Email should contain a @'
        const reg=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        if (this.state.touched.password&&(!reg.test(password))) {
            errors.password = "Password is not valid";
          } 
          if (this.state.touched.passwordConfirmation&&passwordConfirmation!==password) {
            errors.passwordConfirmation = "Password don't match";
          } 
        
        
        return errors;
    }
    render()
    {
        
     const{username,email,password,passwordConfirmation}=this.state
     const errors=this.validate(this.state.username,this.state.email,this.state.password,this.state.passwordConfirmation)
        return(
            <Grid textAlign='center' verticalAlign='middle' className="app">
                <Grid.Column style={{maxWidth:450}}>
                    <Header as="h2" icon color='orange' textAlign='center'>
                    <Icon name='puzzle piece' color='orange'/>
                    Regsiter for DevChat  
                    </Header>
                    <Form onSubmit={this.handleSubmit} size='large'>
                          <Segment stacked>
                              <Form.Input  fluid name='username' icon='user' iconPosition="left"
                              placeholder="Username" onChange={this.handleChange} type='text' value={username} valid={errors.username===''} invalid={errors.username!==''} onBlur={this.handleBlur('username')}/>
                              <div>{errors.username}</div>

<Form.Input fluid name='email' icon='mail' iconPosition="left"
                              placeholder="Email Address" onChange={this.handleChange} type='email' value={email} valid={errors.email===''} invalid={errors.email!==''} onBlur={this.handleBlur('email')}/>
                              <div>{errors.email}</div>

<Form.Input fluid name='password' icon='lock' iconPosition="left"
                              placeholder="Password" onChange={this.handleChange} type='password' value={password} valid={errors.password===''} invalid={errors.password!==''} onBlur={this.handleBlur('password')}/>
                            <div>{errors.password}</div>
<Form.Input fluid name='passwordConfirmation' icon='repeat' iconPosition="left"
                              placeholder="Password Confirmation" onChange={this.handleChange} type='password' value={passwordConfirmation} valid={errors.passwordConfirmation===''} invalid={errors.passwordConfirmation!==''} onBlur={this.handleBlur('passwordConfirmation')}/>
                             <div>{errors.passwordConfirmation}</div>
                          {!username||!email||!password||errors.username||errors.email||errors.password||password!==passwordConfirmation  ? <Button disabled color='orange' fluid size='large'> Submit </Button>:<Button color='orange' fluid size='large'> Submit </Button>}
                          </Segment>
                    </Form>
                  <Message>Already a user?<Link to='/login'> Login</Link>   </Message>  
                </Grid.Column>
            </Grid>
        )
    }
}
export default Register;