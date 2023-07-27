const fs = require("fs");
const openpgp = require("openpgp");


async function encryptFile(file, publicKeyArmored) {
  try {
    
    const fileContent = await readFileAsText(file);

 
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

   
    const encryptedMessage = await openpgp.encrypt({
      message: openpgp.message.fromText(fileContent),
      publicKeys: publicKey,
    });

    
    return encryptedMessage.data;
  } catch (error) {
    console.error("Error encrypting the file:", error.message);
    return null;
  }
}


async function decryptFile(file, privateKeyArmored) {
  try {
    
    const encryptedContent = await readFileAsText(file);


    const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored });

 
    const { data: decryptedData } = await openpgp.decrypt({
      message: await openpgp.message.readArmored(encryptedContent),
      privateKeys: privateKey,
    });


    return decryptedData;
  } catch (error) {
    console.error("Error decrypting the file:", error.message);
    return null;
  }
}


function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}


async function handleEncrypt() {
  const fileToEncrypt = document.getElementById("fileToEncrypt").files[0];
  const publicKeyFile = document.getElementById("publicKeyFile").files[0];

  if (!fileToEncrypt || !publicKeyFile) {
    alert("Please select a file to encrypt and a public key file.");
    return;
  }

  const publicKeyArmored = await readFileAsText(publicKeyFile);
  const encryptedContent = await encryptFile(fileToEncrypt, publicKeyArmored);

  if (encryptedContent) {
    document.getElementById("encryptedContent").value = encryptedContent;
    alert("File encrypted successfully.");
  }
}


async function handleUploadPublicKey() {
  const publicKeyFile = document.getElementById("publicKeyFile").files[0];
  if (!publicKeyFile) {
    alert("Please select a public key file to upload.");
    return;
  }

  const publicKeyArmored = await readFileAsText(publicKeyFile);
  
  alert("Public key uploaded successfully.");
}


async function handleDecrypt() {
  const encryptedFile = document.getElementById("encryptedFile").files[0];
  if (!encryptedFile) {
    alert("Please select an encrypted file to decrypt.");
    return;
  }

  const privateKeyFile = prompt(
    "Enter your private key (pasted directly or via file upload):"
  );
  if (!privateKeyFile) {
    alert("Please provide your private key.");
    return;
  }

  const privateKeyArmored = await readFileAsText(privateKeyFile);
  const decryptedContent = await decryptFile(encryptedFile, privateKeyArmored);

  if (decryptedContent) {
    document.getElementById("decryptedContent").value = decryptedContent;
    alert("File decrypted successfully.");
  }
}
