import { Avatar, type SxProps } from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import type { Theme } from '@emotion/react';
import { enqueueSnackbar } from 'notistack';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '../firebase/firebase';
interface ImageUploaderProps {
    id?: string;
    value: string;
    onChange: (newVal: string) => void;
    sx?: SxProps<Theme>;
    variant?: "rounded" | "circular" | "square";
    destination: "teachers"
}
const ImageUploader = (props: ImageUploaderProps) => {
    return (
        <>
            <label htmlFor={props.id ?? "imagePicker"}>
                <Avatar
                    sx={{
                        height: 150,
                        width: 150,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        ...props.sx
                    }}
                    variant={props.variant ?? "rounded"}
                    src={props.value.replace('uc', 'thumbnail') ?? ''}
                >
                    {!props.value && <ImageIcon sx={{ fontSize: 100 }} />}
                </Avatar>
            </label >
            <input
                type="file"
                accept="image/*"
                id={props.id ?? "imagePicker"}
                style={{ display: 'none' }}
                onChange={async (e) => {
                    e.preventDefault(); // Prevent the default behavior of the file input

                    if (e.target.files) {
                        console.log('Size is', e.target.files[0].size / 1024, 'KB');
                        if ((e.target.files[0].size / 1024) > 10240) {
                            enqueueSnackbar({
                                message: 'File size cannot be greater than 10 MB',
                                variant: 'error',
                            });
                        } else {
                            const fileRef = ref(storage, `${props.destination}/${Date.now()}-${e.target.files[0].name}`)
                            await uploadBytes(fileRef, e.target.files[0])
                            const url = await getDownloadURL(fileRef)
                            props.onChange(url);
                        }
                    }
                }}
            /></>
    )
}

export default ImageUploader