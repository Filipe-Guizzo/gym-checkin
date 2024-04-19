import { Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";

export default (props: any) => {

    const closeAlert = () => {
        props.closeAlert();
    }

    return (
        <>
            <Collapse in={props.open}>
                <Alert severity={props.type}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={closeAlert}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {props.children}
                </Alert>
            </Collapse>
        </>
    )
}