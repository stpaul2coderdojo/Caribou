// Azure Storage account credentials
const accountName = 'your_storage_account_name';
const accountKey = 'your_storage_account_key';
const containerName = 'your_container_name';

// TinyDB Server endpoint
const tinydbEndpoint = 'https://your_tinydb_server_endpoint';

async function recordCaribouCall() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const chunks = [];

  mediaRecorder.addEventListener('dataavailable', event => {
    chunks.push(event.data);
  });

  mediaRecorder.addEventListener('stop', async () => {
    const blob = new Blob(chunks, { type: 'audio/wav' });
    const base64 = await blobToBase64(blob);
    const json = { base64: base64 };

    // Save JSON to TinyDB Server
    const response = await fetch(`${tinydbEndpoint}/db/data`, {
      method: 'POST',
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Upload JSON to Azure Storage
    const blobServiceClient = new Azure.Storage.Blob.BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      new Azure.Storage.SharedKeyCredential(accountName, accountKey)
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(`${Date.now()}.json`);
    await blobClient.upload(JSON.stringify(json), JSON.stringify(json).length);

    console.log('Recording saved and uploaded successfully');
  });

  mediaRecorder.start();
  console.log('Recording started');

  // Stop recording after 5 seconds
  setTimeout(() => {
    mediaRecorder.stop();
  }, 5000);
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}
