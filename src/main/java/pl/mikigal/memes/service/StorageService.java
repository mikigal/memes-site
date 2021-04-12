package pl.mikigal.memes.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class StorageService {

    private final String imagemagickPath;
    private final File usersDirectory;
    private final File memesDirectory;

    public StorageService(@Value("${memes.imagemagick}") String imagemagickPath,
                          @Value("${memes.storage}") String storageLocation) {

        this.imagemagickPath = imagemagickPath;
        try {
            new ProcessBuilder(this.imagemagickPath).start();
        } catch (IOException e) {
            throw new IllegalStateException("invalid imagemagick path");
        }

        File storage = new File(storageLocation);

        if (!storage.exists() || !storage.isDirectory()) {
            throw new IllegalStateException("Invalid storage location");
        }

        this.usersDirectory = new File(storage, "users");
        this.memesDirectory = new File(storage, "memes");

        usersDirectory.mkdir();
        memesDirectory.mkdir();
    }

    /**
     * Store image of meme or user's avatar and compress it
     * @param uploadType type of upload, it can be meme or user's avatar
     * @param bytes image data
     * @return UUID of uploaded image
     * @throws RuntimeException if imagemagick fail while compressing image
     */
    public UUID store(UploadType uploadType, byte[] bytes) {
        UUID uuid = UUID.randomUUID();

        File uploadDirectory = uploadType == UploadType.MEME ? this.memesDirectory : this.usersDirectory;
        File original = new File(uploadDirectory, uuid + "-original");
        File compressed = new File(uploadDirectory, uuid + ".png");

        try {
            BufferedOutputStream originalWriter = new BufferedOutputStream(new FileOutputStream(original));
            originalWriter.write(bytes);
            originalWriter.flush();
            originalWriter.close();

            if (!this.compress(original, compressed)) {
                original.delete();
                compressed.delete();
                throw new RuntimeException("imagemagick didn't finished compressing in 10 seconds");
            }

            original.delete();
            return uuid;
        } catch (IOException | InterruptedException e) {
            original.delete();
            compressed.delete();
            throw new RuntimeException(e);
        }
    }

    /**
     * Compress given image with ImageMagick
     * @param original image which you want to compress
     * @param output path where compressed image should be saved
     * @return true on success, else false
     * @throws IOException if ImageMagic has non-zero exit code
     * @throws InterruptedException if the current thread is interrupted while waiting for exiting process
     */
    private boolean compress(File original, File output) throws IOException, InterruptedException {
        return new ProcessBuilder()
                .command(
                        this.imagemagickPath,
                        original.toPath().toAbsolutePath().toString(),

                        "-geometry", "700x",
                        "-depth", "8",
                        "-quality",  "97%",
                        "-filter", "Lanczos",
                        "-interlace", "Plane",

                        output.toPath().toAbsolutePath().toString())
                .redirectError(ProcessBuilder.Redirect.INHERIT)
                .start()
                .waitFor(10, TimeUnit.SECONDS);
    }
}
