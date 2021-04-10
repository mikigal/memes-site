package pl.mikigal.memes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.io.File;

@Configuration
public class ApplicationConfiguration extends WebMvcConfigurerAdapter {

    private String storageDirectory;

    public ApplicationConfiguration(@Value("${memes.storage}") String storageDirectory) {
        this.storageDirectory = storageDirectory;

        if (!this.storageDirectory.endsWith(File.separator)) {
            this.storageDirectory += File.separator;
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + storageDirectory);
    }
}
