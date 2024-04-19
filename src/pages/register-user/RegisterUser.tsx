import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import Spinner from "../../components/spinner/Spinner";
import Alert from "../../components/alert/Alert";
import { Link, useNavigate } from "react-router-dom";
import { CreateUserRequest } from "../../models/user/CreateUserResquest";
import UserService from "../../services/user/UserService";

export default () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [alert, setAlert] = useState({open: false, text: '', type: '', });
    const userService = new UserService();
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
                    CADASTRO
                </Typography>

                <TextField id="name" label="Nome" variant="filled" margin="normal" sx={{ width: '350px' }} value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                    }}
                />
                <TextField id="email" label="E-mail" variant="filled" margin="normal" sx={{ width: '350px' }} value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <TextField id="password" label="Senha" variant="filled" margin="normal" sx={{ width: '350px' }} value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
                <Button variant="contained" color="success" sx={{width: '350px', marginTop: '20px'}}
                    disabled={name==='' || email==='' || password===''}
                    onClick={async () => {
                        setOpenBackdrop(true);
                        const request: CreateUserRequest = { name: name, email: email, password: password, role: 1 };
                        const response = await userService.createUser(request);
                        
                        if(response.status == 200){
                            setAlert({open: true, text: 'Criado com sucesso!', type: 'success'});
                            setTimeout(()=>{ navigate('/'); }, 2000);
                        
                        }else{
                            setAlert({open: true, text: 'Erro ao cadastrar usuário!', type: 'error'});
                        }
                        setOpenBackdrop(false);
                    }}>
                    Cadastrar
                </Button>
                <Link to={'/'} style={{textDecoration: 'none', fontSize: '20px', marginTop: '20px', color:'#000'}}>Já tem uma conta?</Link>
            </Box>

            <Alert type={alert.type} open={alert.open} closeAlert={()=>{setAlert({open: false, text: '', type: '', })}} >{alert.text}</Alert>

        </Container>

        <Spinner open={openBackdrop} />
        </>
    );
}