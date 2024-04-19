import { AppBar, Box, Button, Container, TextField, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GymService from "../../services/gym/GymService";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Cookies from "js-cookie";
import { CreateGymRequest } from "../../models/gym/CreateGymRequest";
import Alert from "../../components/alert/Alert";
import UserService from "../../services/user/UserService";
import CheckinService from "../../services/checkin/CheckinService";

export default () => {

    const navigate = useNavigate();
    const { logout }: any = useAuth();
    const [gyms, setGyms] = useState([]);
    const [historic, setHistoric] = useState([]);
    const gymService = new GymService();
    const userService = new UserService();
    const checkinService = new CheckinService();
    const [searchName, setSearchName] = useState('');
    const role = Cookies.get('ROLE');
    const [alert, setAlert] = useState({ open: false, text: '', type: '', });

    const [gymsPage, setGymsPage] = useState(true);
    const [gymRegisterPage, setGymRegisterPage] = useState(false);
    const [profilePage, setProfilePage] = useState(false);
    const [historicPage, setHistoricPage] = useState(false);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const USER_ID = Number(Cookies.get('USER_ID'));

    const [user, setUser] = useState({ userName: '', userEmail: '' });

    const selectPage = (page: number) => {
        if (page === 1) {
            setGymsPage(true);
            setGymRegisterPage(false);
            setProfilePage(false);
            setHistoricPage(false);
        } else if (page === 2) {
            setGymsPage(false);
            setGymRegisterPage(true);
            setProfilePage(false);
            setHistoricPage(false);
        } else if (page === 3) {
            setGymsPage(false);
            setGymRegisterPage(false);
            setProfilePage(true);
            setHistoricPage(false);
        } else if (page === 4) {
            setGymsPage(false);
            setGymRegisterPage(false);
            setProfilePage(false);
            setHistoricPage(true);
        }
    }

    const resetForm = () => {
        setName('');
        setDescription('');
        setPhone('');
    }

    const getGeolocation = () => {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        //console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                        resolve({ latitude, longitude });
                    }
                );
            }
        });
    }

    const getLatLong = async () => {
        return await getGeolocation().then((position: any) => {
            return { lat: position.latitude, long: position.longitude }
        })
    }

    const gymColumns: GridColDef[] = [
        { field: 'gymId', headerName: 'ID', width: 150, cellClassName: 'justified-cell' },
        { field: 'gymName', headerName: 'NOME', width: 150, cellClassName: 'justified-cell' },
        { field: 'gymDescription', headerName: 'DESCRIÇÃO', width: 150, cellClassName: 'justified-cell' },
        { field: 'gymPhone', headerName: 'TELEFONE', width: 150, cellClassName: 'justified-cell' },
        { field: 'gymLat', headerName: 'LATITUDE', width: 150, cellClassName: 'justified-cell' },
        { field: 'gymLong', headerName: 'LONGITUDE', width: 150, cellClassName: 'justified-cell' },
        {
            field: 'gymCheckin', headerName: 'FAZER CHECK-IN', width: 150, cellClassName: 'justified-cell',
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="success"
                    onClick={async () => {
                        const response = await checkinService.createCheckin(params.row.gymId, USER_ID);
                        const responseDatas = await checkinService.findById(USER_ID, 1);
                        setHistoric(responseDatas.data);
                        if (response.status == 201) {
                            setAlert({ open: true, text: 'Check-in realizado com sucesso!', type: 'success' });
                        } else {
                            setAlert({ open: true, text: 'Erro ao realizar check-in!', type: 'error' });
                        }
                    }}
                >
                    CHECK-IN
                </Button>
            ),
        },
    ];

    const historicColumns: GridColDef[] = [
        { field: 'userCiId', headerName: 'ID', width: 250, cellClassName: 'justified-cell' },
        { field: 'gym', valueGetter: (gym: any) => { return gym.gymName; }, headerName: 'ACADEMIA', width: 200, cellClassName: 'justified-cell' },
        { field: 'date', headerName: 'DATA', width: 250, cellClassName: 'justified-cell' },
        { field: 'hour', headerName: 'HORA', width: 250, cellClassName: 'justified-cell' },
    ]

    useEffect(() => {
        const findByName = async () => {
            const response = await gymService.findByName('', 1);
            setGyms(response.data);
        }

        findByName();
    }, []);

    useEffect(() => {
        const findUserById = async () => {
            const response = await userService.findById(USER_ID);
            setUser(response.data);
        }

        findUserById();
    }, []);

    useEffect(() => {
        const findById = async () => {
            const response = await checkinService.findById(USER_ID, 1);
            setHistoric(response.data);
        }

        findById();
    }, []);

    return (
        <>
            <Box width={'100%'} sx={{ flexGrow: 1 }}>
                <AppBar position="static" color="transparent">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block', color: '#fff' } }}
                        >
                            Dashboard
                        </Typography>
                        <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                            {role === 'USER' ? null : <Button
                                onClick={() => {
                                    selectPage(2);
                                }}
                                sx={{ m: 2, color: 'white', display: 'block' }}
                            >
                                CADASTRAR ACADEMIAS
                            </Button>}

                            <Button
                                onClick={() => {
                                    selectPage(1);
                                }}
                                sx={{ m: 2, color: 'white', display: 'block' }}
                            >
                                ACADEMIAS
                            </Button>
                            <Button
                                onClick={() => {
                                    selectPage(3);
                                }}
                                sx={{ m: 2, color: 'white', display: 'block' }}
                            >
                                PERFIL
                            </Button>
                            <Button
                                onClick={() => {
                                    selectPage(4);
                                }}
                                sx={{ m: 2, color: 'white', display: 'block' }}
                            >
                                HISTORICO
                            </Button>
                            <Button
                                variant='contained'
                                color='error'
                                onClick={() => {
                                    navigate('/');
                                    logout();
                                }}
                                sx={{ m: 2, display: 'block' }}
                            >
                                SAIR
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            {
                !gymsPage ? null :
                    <Container maxWidth="xl" sx={{
                        height: '90vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height={600} width={1200} sx={{
                            bgcolor: '#fff',
                            borderRadius: '20px',
                        }}>
                            <div>
                                <TextField id="search" label="Pesquise pelo nome da academia:" variant="outlined" sx={{ m: 2, width: '65vw' }}
                                    onChange={(event: any) => { setSearchName(event.target.value) }}
                                />
                                <Button color="warning" variant="contained" sx={{ m: 2, height: '7.5vh' }}
                                    onClick={async () => {
                                        const response = await gymService.findByName(searchName, 1);
                                        setGyms(response.data);
                                    }}
                                >BUSCAR</Button>
                            </div>
                            <DataGrid
                                getRowId={(gym) => gym.gymId}
                                rows={gyms}
                                columns={gymColumns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 20 },
                                    },
                                }}
                            />
                        </Box>
                        <Alert type={alert.type} open={alert.open} closeAlert={() => { setAlert({ open: false, text: '', type: '', }) }} >{alert.text}</Alert>
                    </Container>
            }

            {
                !gymRegisterPage ? null :
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
                                CADASTRAR
                            </Typography>

                            <TextField id="name" label="Nome" variant="filled" margin="normal" sx={{ width: '350px' }} value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                }}
                            />
                            <TextField id="description" label="Descrição" variant="filled" margin="normal" sx={{ width: '350px' }} value={description}
                                onChange={(event) => {
                                    setDescription(event.target.value);
                                }}
                            />
                            <TextField id="phone" label="Telefone" variant="filled" margin="normal" sx={{ width: '350px' }} value={phone}
                                onChange={(event) => {
                                    setPhone(event.target.value);
                                }}
                            />
                            <Button variant="contained" color="success" sx={{ width: '350px', marginTop: '20px' }}
                                disabled={name === '' || description === '' || phone === ''}
                                onClick={async () => {
                                    const latLong = await getLatLong();
                                    const request: CreateGymRequest = { name: name, description: description, phone: phone, lat: latLong.lat, long: latLong.long };
                                    const response = await gymService.createGym(request);

                                    if (response.status === 201) {
                                        const response = await gymService.findByName('', 1);
                                        setGyms(response.data);
                                        setAlert({ open: true, text: 'Criado com sucesso!', type: 'success' });
                                        resetForm();

                                    } else {
                                        setAlert({ open: true, text: 'Erro ao criar!', type: 'error' });
                                    }
                                }}>
                                Cadastrar
                            </Button>
                        </Box>
                        <Alert type={alert.type} open={alert.open} closeAlert={() => { setAlert({ open: false, text: '', type: '', }) }} >{alert.text}</Alert>
                    </Container>
            }

            {
                !profilePage ? null :
                    <Container maxWidth="xl" sx={{
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}>
                        <Box display="flex" flexDirection="column" justifyContent="start" alignItems="center" height={500} width={600} sx={{
                            bgcolor: '#fff',
                            borderRadius: '20px',
                        }}>
                            <Typography variant="h2" component="h2" m={5}>
                                PERFIL
                            </Typography>

                            <TextField id="name" label="Nome" variant="filled" margin="normal" sx={{ width: '350px' }}
                                value={user.userName} InputProps={{ readOnly: true }} />
                            <TextField id="email" label="E-mail" variant="filled" margin="normal" sx={{ width: '350px' }}
                                value={user.userEmail} InputProps={{ readOnly: true }} />

                        </Box>
                    </Container>
            }

            {
                !historicPage ? null :
                    <Container maxWidth="xl" sx={{
                        height: '90vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}>
                        <Box display="flex" justifyContent="center" alignItems="center" height={600} width={1000} sx={{
                            bgcolor: '#fff',
                        }}>
                            <DataGrid
                                getRowId={(checkin) => checkin.userCiId}
                                rows={historic}
                                columns={historicColumns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 20 },
                                    },
                                }}
                            />
                        </Box>
                    </Container>
            }

        </>
    )
}