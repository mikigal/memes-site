package pl.mikigal.memes.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.io.*;
import java.util.UUID;

@Service
public class StorageService {

    private final File usersDirectory;
    private final File memesDirectory;

    public StorageService(@Value("${memes.storage}") String storageLocation) {
        File storage = new File(storageLocation);

        if (!storage.exists() || !storage.isDirectory()) {
            throw new IllegalStateException("Invalid storage location");
        }

        this.usersDirectory = new File(storage, "users");
        this.memesDirectory = new File(storage, "memes");

        usersDirectory.mkdir();
        memesDirectory.mkdir();
    }

    public UUID storeMeme(String uploadName, byte[] bytes) {
        if (!uploadName.contains(".")) {
            return null;
        }

        String format = uploadName.split("\\.")[uploadName.split("\\.").length - 1];
        if (!format.equalsIgnoreCase("jpg") &&
                !format.equalsIgnoreCase("jpeg") &&
                !format.equalsIgnoreCase("png")) {
            return null;
        }

        try {
            // Is it valid image?
            ImageIO.read(new ByteArrayInputStream(bytes));
        } catch (Exception e) {
            return null;
        }

        UUID uuid = UUID.randomUUID();
        File file = new File(this.memesDirectory, uuid + "." + format);
        try {
            BufferedOutputStream writer = new BufferedOutputStream(new FileOutputStream(file));
            writer.write(bytes);
            writer.flush();
            writer.close();
            return uuid;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
