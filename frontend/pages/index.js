import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import abi from "../artifacts/contracts/fiverNFT.sol/fiverNFT.json";
export default function Home() {
  const [signer,setSigner] = useState(null);
  const [connected,setConnected] = useState(false);
  const [address,setAddress] = useState(null);
  const [contract,setContract] = useState(null);
  const [mint,setMint] = useState(0);

  const connect = async () => {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      setSigner(signer);
      setContract(new ethers.Contract("0xbf7F9af9e3503ff626A5facBA87E24a34643a7f5",abi["abi"], signer));
      setAddress(await signer.getAddress());
      setConnected(true);
    }
    catch(e){
      alert(e);
    }
  }


  const giveaway = async () => {
    try{
      const num = document.getElementById("number").value;
      const addresses = await contract.whitelistedAddressesList();
      if(num == 0){
        throw new Error("Enter number greater than 0")
      }
      if(addresses.length < num){
        throw new Error("less whitelisted address than entered amout");
      }
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
      const tx =await contract.mintBundle(selectedAddress);
      await tx.wait();
      alert("Successfully given away");
    }
    catch(e){
      alert(e);
    }
    
  }

  const reveal = async () => {
    try{
      const tx =await contract.reveal();
      await tx.wait();
      alert("Successfully revealed");
    }
    catch(e){
      alert(e);
    }
  }

  const minted = async () => {
    try{
      setMint(await contract.tokenIds());
    }
    catch(e){ 
      alert(e);
    }
  }

  


  useEffect(()=>{
    if(connected){
      minted();
    }
  },[connected]);
  

  return (
    <div className='m-10'>
      <Head>
        <title>ALien NFT</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex flex-row-reverse items-center gap-4'>
        <button onClick={connect} className="p-4 rounded-xl bg-green-300">{connected ? "Connected" : "Connect wallet"}</button>
        <div>
          Nfts Minted : {mint}
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 mt-5'>
        <div className='flex flex-col items-center gap-4 border-black'>
          <p>Click the below button to reveal the Nfts</p>
          <button onClick={reveal} className="p-4 rounded-xl bg-green-300">Reveal</button>
        </div>          
        <div className='flex flex-col items-center gap-4 border-black'>
          <input className="h-10" placeholder='Enter number' id="number"></input>
          <button onClick={giveaway} className="p-4 rounded-xl bg-green-300">Giveaway</button>
        </div>               
      </div>
    </div>
  )
}
