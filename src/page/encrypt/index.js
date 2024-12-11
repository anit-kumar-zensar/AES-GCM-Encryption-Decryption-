
import React, { useState } from 'react';
import { CryptoService } from '../../utils/CryptoService';

const cryptoService = new CryptoService(); // Instantiate the service here

const MyComponent = () => {
  const [encryptedData, setEncryptedData] = useState('');
  const [decryptedData, setDecryptedData] = useState('');
  const key = 'your-encryption-key';
  const data = 'My screte data';

  const handleEncryption = async () => {
    try {
      const encrypted = await cryptoService.encryptData(key, data); // Use instance method
      setEncryptedData(encrypted);
    } catch (error) {
      console.error('Encryption failed', error);
    }
  };

  const handleDecryption = async () => {
    try {
      const decrypted = await cryptoService.decryptData(key, encryptedData); // Use instance method
      setDecryptedData(decrypted);
    } catch (error) {
      console.error('Decryption failed', error);
    }
  };

  return (
    <div>
      <button onClick={handleEncryption}>Encrypt Data</button>
      <button onClick={handleDecryption}>Decrypt Data</button>
      <div>
        <h3>Encrypted Data</h3>
        <p>{encryptedData}</p>
      </div>
      <div>
        <h3>Decrypted Data</h3>
        <p>{decryptedData}</p>
      </div>
    </div>
  );
};

export default MyComponent;
