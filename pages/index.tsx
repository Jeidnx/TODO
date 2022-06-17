import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Index.module.css'
import {Todo} from "../types";
import {getTodos} from '../lib/redis';
import {
    Alert,
    AlertTitle, Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab, IconButton, Paper, Stack, TextField,
    useMediaQuery
} from "@mui/material";


import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';

import {FormEvent, useCallback, useState} from "react";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async ({res}) => {
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    );
    const todos = await getTodos();
    console.log(todos);
    return {
        props: {todos: (await getTodos())}
    }
}

const Home: NextPage<{todos: Todo[]}> = (props) => {

    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<undefined | string>(undefined);

    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.target as HTMLFormElement);
        const formData = Object.fromEntries(form.entries());

        fetch('/api/addTodo', {
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        }).then((res) => {
            console.log(res);
            //TODO: Refresh todos, without refreshing page if js is enabled
            if(res.ok){
                window.location.reload()
            }else{
                setErrorMessage(res.statusText);
            }
        });
    }, [])

    const isFs = useMediaQuery('(max-width: 800px)');
    const todos = props.todos;
    if(!Array.isArray(todos)) return null;
    return (
    <div className={styles.container}>
      <Head>
        <title>//TODO</title>
        <meta name="description" content="Simple todo app, to quickly add and manage TODOs with your friends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <Dialog
              open={open}
              onClose={() => {
                  setOpen(false);
              }}
             fullScreen={isFs}
          >
              <DialogTitle>TODO Hinzufügen</DialogTitle>
              <DialogContent>
                  <Alert
                      sx={{
                          display: typeof errorMessage === 'undefined' ? 'none' : '',
                      }}
                      severity="error">
                      <AlertTitle>Fehler</AlertTitle>
                      {errorMessage}
                  </Alert>
                  <DialogContentText>
                      <form
                          style={{
                              margin: "10px",
                          }}
                          onSubmit={handleSubmit}
                      >
                          <Stack
                              spacing={2}
                          >
                          <TextField
                              label={"Beschreibung"}
                              name={"description"}
                              fullWidth
                          />
                          <TextField
                              label={"Priorität"}
                              name={"priority"}
                              type={"number"}
                              inputProps={{
                                  maxLength: 13
                              }}
                              fullWidth
                              />
                          <Button variant={"contained"} disableElevation={true} disableFocusRipple={true} disableTouchRipple={true} disableRipple={true} type={'submit'}>Hinzufügen</Button>
                          </Stack>
                      </form>
                  </DialogContentText>
                  <DialogActions>
                      <Button
                          onClick={() => {
                              setOpen(false);
                          }}
                      >Abbrechen</Button>
                  </DialogActions>
              </DialogContent>
          </Dialog>

        <h1 className={styles.title + ' ' +  styles.code}>//TODO:</h1>

          <Box
          sx={{
              width: "80vw",
              height: "100%",
              overflowY: "scroll",
              padding: "2%",
          }}
          >
          {
              todos.length > 0 ? todos.map((todo, idx) => (
                  <Paper
                      //elevation={todo.priority}
                      key={idx}
                      sx={{
                          marginBottom: "20px",
                          padding: "2px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                  }}
                  >
                      <span className={styles.todo} key={idx}>{todo.description}</span>
                      <Box ml={'auto'} />
                      <IconButton size={"large"}><CheckCircleTwoToneIcon  fontSize={"large"}/></IconButton>
                  </Paper>
              )) : <p className={styles.description}>Es gibt nichts zu tun</p>
          }
          </Box>
          <Fab
              sx={{
                  position: 'absolute',
                  bottom: 30,
                  right: 30,
              }}
            variant={"circular"}
            onClick={() => {
                setOpen(true);
            }}
          ><AddIcon /></Fab>
      </main>

      <footer className={styles.footer}>
        <Link href="/impressum">
            <a>Impressum</a>
        </Link>
      </footer>
    </div>
  )
}

export default Home
