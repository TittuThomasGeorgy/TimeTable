import { IconButton, Tooltip } from '@mui/material'
import  { type ReactNode } from 'react'

interface Props{
    onClick:()=>void;
    title:string;
    icon:ReactNode;
}
const CustomIconButton = (props:Props) => {
    return (
        <Tooltip title={props.title}>

            <IconButton  onClick={props.onClick}>
                {props.icon}
            </IconButton>
        </Tooltip>
    )
}

export default CustomIconButton