import React, { useState } from 'react';
import { Button, Form, Container, Card } from 'react-bootstrap';
import { apiCall } from '../Services/apiService';
import { useNavigate } from 'react-router-dom';
var inspect = require('util-inspect');

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginProgress, setLoginProgress] = useState(false);
    const [loginResult, setLoginResult] = useState('');

    const navigate = useNavigate();

    function makeLoginRequest(email, password) {
        const data = {
            user: email,
            password: password,
        };
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        apiCall(data, headers,
            (responseJson) => {

                if (responseJson.uhoh) {
                    setLoginResult(responseJson.message);
                } else {
                    setLoginResult("");
                    window.sessionStorage.setItem("farms", JSON.stringify(responseJson.farms));
                    window.sessionStorage.setItem("user", JSON.stringify({ userID: responseJson.user, email: email, password: password }));
                    window.sessionStorage.setItem("readings", JSON.stringify(responseJson.readings));
                    navigate("/farms");
                }
            },
            (error) => {
                setLoginProgress(false);
                setLoginResult(error.toString() || error);
            }
        );
    }

    const login = async () => {
        setLoginProgress(true);
        makeLoginRequest(email, password);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '400px' }} className="p-4">
                <h2>PastureCoach</h2>
                {loginResult ? <p style={{ color: 'red' }}>{loginResult}</p> : null}
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        {loginProgress ? <p>Logging in...</p> : (
                            <Button onClick={login} >Login</Button>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login;