import React from "react";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { Routes } from './routes';
import './App.css';

export default ()=>{
  return(
    <>
      <BrowserRouter>
        <Routes/>
      </BrowserRouter>
    </>
  );
}