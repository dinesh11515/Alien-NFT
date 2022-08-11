import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import abi from "../artifacts/contracts/fiverNFT.sol/fiverNFT.json";
export default function Home() {
  const [signer,setSigner] = useState(null);
  const [connected,setConnected] = useState(false);
  const [address,setAddress] = useState(null);
  const [contract,setContract] = useState(null);
  const connect = async () => {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      setSigner(signer);
      setContract(new ethers.Contract("0xFebBEC9a3Af4C9E2f9635e81A4Fb6D033A646AA3",abi["abi"], signer));
      setAddress(await signer.getAddress());
      setConnected(true);
    }
    catch(e){
      alert(e);
    }
  }


  const giveaway = async (num) => {
    try{
      const addresses = await contract.whitelistedAddressesList();
      let selectedAddress = [];
      let i=0;
      while(i<num){
        const random = Math.floor(Math.random() * addresses.length);
        const check = await contract.giveawayWinners(addresses[random]);
        console.log(random,check);
        if(!check && selectedAddress.indexOf(addresses[random])==-1){
          selectedAddress.push(addresses[random]);
          i++;
        }
      }
      // const tx =await contract.mintBundle(selectedAddress);
      // await tx.wait();
      // alert("Success");
    }
    catch(e){
      alert(e);
    }
    
  }

  console.log(address,contract);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-row-reverse m-5'>
        <button onClick={connect} className="p-4 rounded-xl bg-green-300">{connected ? "Connected" : "Connect wallet"}</button>
      </div>
      <div>
        <button onClick={()=>{giveaway(2)}} className="ml-80 p-4 rounded-xl bg-green-300">Giveaway</button>
      </div>
      <ToastContainer />
    </div>
  )
}