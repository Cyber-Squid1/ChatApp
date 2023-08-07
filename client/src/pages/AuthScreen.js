/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react'
import { Box, Stack, Typography, Button, TextField, Card, CircularProgress, Alert } from '@mui/material'
import { useMutation } from '@apollo/client'
import { SIGNUP_USER, LOGIN_USER } from '../graphql/mutations';
const AuthScreen = ({ setLoggedIn }) => {
    const [showLogin, setShowLogin] = useState(true);
    const [formData, setFormData] = useState({});
    const authForm = useRef(null);
    const [signupUser, { data: signupData, loading: l1, error: e1 }] = useMutation(SIGNUP_USER);
    const [loginUser, { data: loginData, loading: l2, error: e2 }] = useMutation(LOGIN_USER, {
        onCompleted(data) {
            localStorage.setItem('jwt', data.signInUser.token)
            setLoggedIn(true)
        }
    });

    if (l1 || l2) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Box textAlign="center">
                    <CircularProgress />
                    <Typography variant='h6'>Authenticating...</Typography>
                </Box>
            </Box>
        )
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (showLogin) {
            loginUser({ variables: { userSignIn: formData } })
        }
        else {
            signupUser({ variables: { newUser: formData } })
        }
    }
    return (
        <Box
            ref={authForm}
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh"
        >
            <Card
                variant='outlined'
                sx={{ padding: "10px" }}
            >
                <Stack
                    direction="column"
                    spacing={2}
                    sx={{ width: "400px" }}
                >
                    {signupData && <Alert severity="success">{signupData.signUpUser.Firstname} Signed Up</Alert>}
                    {e1 && <Alert severity="error">{e1.message}</Alert>}
                    {e2 && <Alert severity="error">{e2.message}</Alert>}
                    <Typography variant='h5'>Please {showLogin ? "Login" : "Signup"}</Typography>
                    {
                        !showLogin &&
                        <>
                            <TextField
                                name='FirstName'
                                label='First Name'
                                variant='standard'
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                name='LastName'
                                label='Last Name'
                                variant='standard'
                                onChange={handleChange}
                                required
                            />
                        </>
                    }
                    <TextField
                        type='email'
                        name='Email'
                        label='Email'
                        variant='standard'
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        type='password'
                        name='Password'
                        label='Password'
                        variant='standard'
                        onChange={handleChange}
                        required
                    />
                    <Button variant='outlined' size='small' disableElevation onClick={() => {
                        setShowLogin((preValue) => !preValue);
                        setFormData({});
                        authForm.current.reset()
                    }}>{showLogin ? "Create Account?" : "Already have an account?"}</Button>
                    {/* <Typography textAlign="center" variant='subtitle1' onClick={() => {
                        setShowLogin((preValue) => !preValue);
                        setFormData({});
                        authForm.current.reset()
                    }}> {showLogin ? "Signup?" : "Login?"}
                    </Typography> */}
                    <Button variant='contained' type="submit" >{showLogin ? "Login" : "Signup"}</Button>
                </Stack>
            </Card>
        </Box>
    )
}

export default AuthScreen
