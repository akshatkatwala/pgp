const openpgp = require("openpgp");

async function generateKeyPair() {
  const { privateKeyArmored, publicKeyArmored } = await openpgp.generateKey({
    type: "ecc",
    curve: "curve25519", 
    userIds: [{ name: "Your Name", email: "your.email@example.com" }],
  });

  return { privateKey: privateKeyArmored, publicKey: publicKeyArmored };
}

async function encryptMessage(message, publicKeyArmored) {
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  const { data: encrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(message),
    publicKeys: publicKey,
  });

  return encrypted;
}

async function decryptMessage(encryptedMessage, privateKeyArmored) {
  const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored });
  const { data: decrypted } = await openpgp.decrypt({
    message: await openpgp.message.readArmored(encryptedMessage),
    privateKeys: privateKey,
  });

  return decrypted;
}


async function main() {
  const { privateKey, publicKey } = await generateKeyPair();

  const message = "Hello, world!";
  const encryptedMessage = await encryptMessage(message, publicKey);

  console.log("Encrypted message:", encryptedMessage);

  const decryptedMessage = await decryptMessage(encryptedMessage, privateKey);

  console.log("Decrypted message:", decryptedMessage);
}

main();
