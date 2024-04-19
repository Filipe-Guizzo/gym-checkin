import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import AuthService from "../../services/auth/AuthService";
import { LoginUserRequest } from "../../models/auth/LoginUserRequest";
import Spinner from "../../components/spinner/Spinner";
import Alert from "../../components/alert/Alert";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authService = new AuthService();
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [alert, setAlert] = useState({open: false, text: '', type: '', });
    const { login }: any = useAuth();
    const navigate = useNavigate();

    return (
        <>
        <Container maxWidth="xl" sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'column',
        }}>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height={500} width={600} sx={{
                bgcolor: '#fff',
                borderRadius: '20px',
            }}>
                <Typography variant="h2" component="h2">
                    ENTRAR
                </Typography>

                <TextField id="email" label="E-mail" variant="filled" margin="normal" sx={{ width: '350px' }} value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <TextField id="password" label="Password" variant="filled" margin="normal" sx={{ width: '350px' }} value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
                <Button variant="contained" color="success" sx={{width: '350px', marginTop: '20px'}}
                    disabled={email==='' || password===''}
                    onClick={async () => {
                        setOpenBackdrop(true);
                        const request: LoginUserRequest = { email: email, password: password };
                        const response = await authService.loginUser(request);
                        
                        if(response.status == 200){
                            setAlert({open: true, text: 'Logado com sucesso!', type: 'success'});
                            
                            Cookies.set('JWT_TOKEN', response.data.token);
                            Cookies.set('USER_ID', response.data.userId);
                            Cookies.set('ROLE', response.data.role == 1? 'USER':'ADMIN');

                            setTimeout(()=>{ 
                                login();
                                navigate('/dashboard'); 
                            }, 2000);

                        }else{
                            setAlert({open: true, text: 'E-mail ou Senha incorretos!', type: 'error'});
                        }
                        setOpenBackdrop(false);
                    }}>
                    Entrar
                </Button>
                <Link to={'/register'} style={{textDecoration: 'none', fontSize: '20px', marginTop: '20px', color: '#000'}}>Não tem uma conta?</Link>
            </Box>

            <Alert type={alert.type} open={alert.open} closeAlert={()=>{setAlert({open: false, text: '', type: '', })}} >{alert.text}</Alert>

        </Container>

        <Spinner open={openBackdrop} />
        </>
    );
}