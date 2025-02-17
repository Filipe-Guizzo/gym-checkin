import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

export default (props: any) => {

    return (
        <>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={props.open}
            >
            <CircularProgress color="inherit" />
        </Backdrop>
        </>
    )
}