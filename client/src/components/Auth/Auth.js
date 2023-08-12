import React, {useState, useEffect} from 'react';
import {Paper, Grid, Container, Typography, Avatar, Button} from '@material-ui/core';
import Icon from './icon';
import {useDispatch} from 'react-redux';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles.js';
import Input from './Input';
import { AUTH } from '../../constants/actionTypes';
import {useNavigate} from 'react-router-dom';
import {gapi} from 'gapi-script';
import {GoogleLogin} from 'react-google-login';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const clientId="1069109333761-6luhijjhgb098cmi0ebcrlffvh1v8p7n.apps.googleusercontent.com";
    
    const classes=useStyles();
    const [isSignup, setIsSignup]=useState(false);
    const [showPassword, setShowPassword]=useState(false);
    const [formData, setFormData]=useState(initialState);
    const dispatch=useDispatch();
    const history=useNavigate();

    const handleShowPassword=()=> setShowPassword((prevShowPassword) => !prevShowPassword);

    const switchMode=()=>{
        setIsSignup((prevIsSignup)=> !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(formData);

        if(isSignup){
            dispatch(signup(formData, history));
        }

        else{
            dispatch(signin(formData, history));
        }
    };
    
    const onSuccess = async (res) => {
        console.log("login success! current user: ", res.profileObj);

        const result = res?.profileObj;
        const token = res?.tokenId;

        try{
            dispatch({type: AUTH, data: {result, token}});
            history('/');
        }

        catch(error){
            console.log(error);
        }
    };

    const onFailure=(res)=>{
        console.log("login failed! res: ", res);
    };

    const handleChange=(e)=>{
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    useEffect(()=>{
        function start() {
          gapi.client.init({
            clientId: clientId,
            scope: ""
          })
        };
    
        gapi.load('client:auth2', start);
    });

    return (
        <Container component='main' maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
            
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half />
                                    <Input name='lastName' label='Last Name' handleChange={handleChange} half />
                                </>
                            )
                        }
                        <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
                        <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} showPassword={showPassword} />
                        {isSignup && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' />}
                    </Grid>

                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>

                    {/* <GoogleLogin 
                        clientId={clientId}
                        buttonText="Login"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy={'single_host_origin'}
                        isSignedIn={true}
                    /> */}

                    <GoogleLogin
                        clientId={clientId}
                        render={(renderProps) => (
                        <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                            Google Sign In
                        </Button>
                        )}
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        cookiePolicy="single_host_origin"
                    />

                    <Grid container justify='flex-end'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid> 
                </form>
            </Paper>
        </Container>
    )
}

export default Auth;