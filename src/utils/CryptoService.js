
export class CryptoService {
    // Encrypt data using AES-GCM
    async encryptData(key, data) {
      try {
        const encoder = new TextEncoder();
  
        // Hash the key to ensure it's the correct length (32 bytes for AES-256)
        const keyBuffer = await this.hashKey(key);
  
        // Import the hashed key to create a CryptoKey object
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM' },
          true,
          ['encrypt', 'decrypt']
        );
  
        // Generate initialization vector (IV)
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedData = encoder.encode(data);
        
        // Encrypt the data
        const encryptedData = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv: iv },
          cryptoKey,
          encodedData
        );
  
        // Concatenate IV and encrypted data
        const resultArray = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
        resultArray.set(iv);
        resultArray.set(new Uint8Array(encryptedData), iv.length);
  
        // Return the encrypted data as a base64 string
        return btoa(String.fromCharCode(...resultArray));
      } catch (error) {
        console.error('Encryption failed:', error);
        throw error; // Rethrow error for the caller to handle
      }
    }
  
    // Decrypt data using AES-GCM
    async decryptData(key, encryptedData) {
      try {
        const encoder = new TextEncoder();
  
        // Hash the key to ensure it's the correct length (32 bytes for AES-256)
        const keyBuffer = await this.hashKey(key);
  
        // Import the hashed key to create a CryptoKey object
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM' },
          true,
          ['encrypt', 'decrypt']
        );
  
        // Convert the base64 encrypted data to a byte array
        const encryptedArray = new Uint8Array(
          atob(encryptedData)
            .split('')
            .map((char) => char.charCodeAt(0))
        );
  
        // Extract IV and ciphertext
        const iv = encryptedArray.slice(0, 12);
        const ciphertext = encryptedArray.slice(12);
  
        // Decrypt the data
        const decryptedData = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: iv },
          cryptoKey,
          ciphertext
        );
  
        // Decode and return the decrypted data as a string
        return new TextDecoder().decode(decryptedData);
      } catch (error) {
        console.error('Decryption failed:', error);
        throw error; // Rethrow error for the caller to handle
      }
    }
  
    // Helper function to hash the key to a fixed length (SHA-256)
    async hashKey(key) {
      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(key);
      const hashBuffer = await crypto.subtle.digest('SHA-256', keyBuffer);
  
      // Return the hashed key as the proper 256-bit (32-byte) key
      return hashBuffer;
    }
  }
  
  const cryptoService = new CryptoService();
  
  // Example usage:
  (async () => {
    const key = 'your-encryption-key'; // Original key (can be any length)
    const data = 'Sensitive data to encrypt';
    
    try {
      const encrypted = await cryptoService.encryptData(key, data);
      console.log('Encrypted:', encrypted);
      
      const decrypted = await cryptoService.decryptData(key, encrypted);
      console.log('Decrypted:', decrypted);
    } catch (error) {
      console.error('Error during encryption/decryption:', error);
    }
  })();
  