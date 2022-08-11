const hre = require("hardhat");

async function main() {
  
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);

  console.log("Sleeping ...");
  await sleep(60000);

  await hre.run("verify:verify",{
    address : greeter.address,
    constructorArguments : ["Hello, Hardhat!"],
  })
}


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });