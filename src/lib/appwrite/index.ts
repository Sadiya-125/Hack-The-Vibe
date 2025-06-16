import { Client, Storage, ID } from "appwrite";
import { appwriteConfig } from "./config";

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId);

const storage = new Storage(client);

export async function uploadFile(
  file: File,
  setProgress?: (progress: number) => void,
): Promise<string> {
  try {
    let progress = 0;
    let progressInterval: ReturnType<typeof setInterval> | undefined;

    const uploadSpeedBytesPerSec = 2_400_000;
    const estimatedUploadTime = (file.size / uploadSpeedBytesPerSec) * 1000;
    const updateInterval = 100;
    const totalSteps = Math.max(
      1,
      Math.floor(estimatedUploadTime / updateInterval),
    );

    if (setProgress) {
      setProgress(0);
      progressInterval = setInterval(() => {
        progress += 100 / totalSteps;
        if (progress >= 98) {
          clearInterval(progressInterval!);
          return;
        }
        setProgress(Math.floor(progress));
      }, updateInterval);
    }

    const response = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file,
    );

    if (progressInterval) clearInterval(progressInterval);
    if (setProgress) setProgress(100);

    const url = storage.getFileView(appwriteConfig.bucketId, response.$id);
    return url.toString();
  } catch (error) {
    console.error("Appwrite Upload Error:", error);
    throw error;
  }
}
