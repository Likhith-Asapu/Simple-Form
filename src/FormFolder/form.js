import * as React from 'react';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { storage, database, app } from './firebaseConfig';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage'
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { collection, addDoc } from '@firebase/firestore';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
export default function BasicButtons() {
    const [progress, setProgress] = React.useState(0);
    const [name, setName] = React.useState("");
    const [number, setNumber] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [gender, setGender] = React.useState("");
    const [imgurl, setUrl] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [uploadopen, setUploadopen] = React.useState(false);

    const [nameerr, setNameerr] = React.useState(false);
    const [numbererr, setNumbererr] = React.useState(false);
    const [addresserr, setAddresserr] = React.useState(false);
    const [gendererr, setGendererr] = React.useState(false);
    const [erropen, setErropen] =  React.useState(false);
    const collectionRef = collection(database, 'userinfo');
    const uploadFile = (file) => {
        if (!file)
            return;


        const storageRef = ref(storage, `/files/${file.name}`);
        const imageUpload = uploadBytesResumable(storageRef, file);

        imageUpload.on("state_changed", (snapshot) => {
            const eventprogress = parseInt(snapshot.bytesTransferred * 100 / snapshot.totalBytes);
            setProgress(eventprogress);
        }, (err) => { console.log(err); alert(err.message) },
            () => {
                getDownloadURL(imageUpload.snapshot.ref).then(url => { console.log(url); setUrl(url); setUploadopen(true); })

            })
    }

    const handleUpload = (e) => {
        setUrl("");
        setProgress(0);
        e.preventDefault();
        const file = e.target[0].files[0];
        console.log(file);
        uploadFile(file);
    };

    const handleSubmit = () => {

        if (name.trim().length >= 3 && number.length === 10 && address.trim().length >= 10 && gender !== "" && imgurl !== "") {

            addDoc(collectionRef, {
                name: name,
                gender: gender,
                url: imgurl,
                number: number,
                address: address
            }).then(() => {

                setOpen(true);
                setName("");
                setNumber("");
                setGender("");
                setAddress("");
               
            }).catch((err) => {
                alert(err.message);
            })
        }
        else {
            if (name.trim().length < 3) {
                setNameerr(true);
            }
            if (number.length !== 10) {
                setNumbererr(true);
            }

            if (address.trim().length < 10) {
                setAddresserr(true);
            }
            if (gender === "") {
                setGendererr(true);
            }
            setErropen(true);

        }

    }

    return (

        <Grid style={{
            minHeight: '100vh',
            backgroundColor: 'rgba(0, 100, 100, 0.1)',
        }}
            container>
            <Grid xs={0} md={2} item></Grid>
            <Grid xs={12} md={8} item>
                <Paper elevation={8} style={{
                    marginTop: '5vh',
                    marginBottom: '5vh',
                }}>
                    <div style={{
                        backgroundColor: 'rgb(2, 91, 150)',
                        textAlign: 'center',
                        padding: '10vh',
                        color: 'white'
                    }}><Typography variant="h2" >
                            User Form
                        </Typography></div>
                    <Stack spacing={5} direction="column" padding={10}>
                        <TextField
                            required
                            label="Name"
                            defaultValue=""
                            inputProps={{ style: {} }}
                            value={name}
                            onChange={(e) => { setName(e.target.value); setNameerr(false) }}
                            helperText="Min. 3 characters"
                            error={nameerr}
                        />
                        <TextField
                            required
                            label="Number"
                            defaultValue=""
                            type="number"
                            value={number}
                            onChange={(e) => { setNumber(e.target.value); setNumbererr((false)) }}
                            helperText="10 digit number"
                            error={numbererr}
                        />

                        <FormControl >
                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                            <Select
                                label="Gender"
                                value={gender}
                                onChange={(e) => { setGender(e.target.value); setGendererr(false) }}
                                error={gendererr}
                            >
                                <MenuItem value={"Male"}>Male</MenuItem>
                                <MenuItem value={"Female"}>Female</MenuItem>
                                <MenuItem value={"Other"}>Other</MenuItem>
                                <MenuItem value={"Prefer not to say"}>Prefer not to say</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            required
                            label="Address"
                            multiline
                            rows={4}
                            defaultValue=""
                            variant="outlined"
                            value={address}
                            onChange={(e) => { setAddress(e.target.value); setAddresserr(false) }}
                            helperText="Min. 10 characters"
                            error={addresserr}
                        />
                        <form onSubmit={handleUpload}>
                            <input accept="image/*" type="file" onClick={() => {
                                setUrl("");
                                setProgress(0);
                            }} />
                            <Button type="submit" size='small' variant="contained" style={{
                            backgroundColor: 'rgb(2, 91, 150)'}}>
                                Upload
                            </Button>
                        </form>

                        <Box sx={{ alignItems: 'center', display: 'flex' }}>
                            <Box sx={{ width: '90%', mr: 1 }}>
                                <LinearProgress variant="determinate" value={progress} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body1" color="text.secondary">{progress} %</Typography>
                            </Box>
                        </Box>
                        <Grid xs={12} justifyContent='center' container><Button type="submit" variant="contained" style={{
                            backgroundColor: 'rgb(2, 91, 150)', fontSize: "20px", minWidth: "40vh"
                        }} size="large" onClick={handleSubmit}>
                            Submit
                        </Button></Grid>
                    </Stack>
                    <div style={{
                        backgroundColor: 'rgb(255, 255, 255)',
                        padding: '1vh',
                    }}></div>
                </Paper>
            </Grid>

            <Grid xs={0} md={2} item></Grid>
            <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
                <MuiAlert onClose={() => setOpen(false)} elevation={6} variant="filled" severity="success" sx={{ width: '100%' }}>
                    Data added successfully
                </MuiAlert>
            </Snackbar>

            <Snackbar open={uploadopen} autoHideDuration={4000} onClose={() => setUploadopen(false)}>
                <MuiAlert onClose={() => setUploadopen(false)} elevation={6} variant="filled" severity="success" sx={{ width: '100%' }}>
                    Image Uploaded to Cloud
                </MuiAlert>
            </Snackbar>

            <Snackbar open={erropen} autoHideDuration={4000} onClose={() => setErropen(false)}>
                <MuiAlert onClose={() => setErropen(false)} elevation={6} variant="filled" severity="error" sx={{ width: '100%' }}>
                    Fill all details / Upload Image
                </MuiAlert>
            </Snackbar>
        </Grid>
    );
}
