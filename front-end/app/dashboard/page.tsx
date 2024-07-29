'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from "next/navigation";
import axios from 'axios';

export async function Login() {
  const router = useRouter();
  //check if the user came from /auth/login and show toast
  const searchParams = useSearchParams()
  const registered = searchParams.get('logged')
  useEffect(() => {
    if(registered){
      toast.success('Welcome!')
    }
  }, [registered])

  return (
    <>
      <ToastContainer/>
    </>
  )
}

export async function getData(){
    try {
        const data = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/`)

    } catch(error) {

    }
}