package com.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.Map;

/**
 * Created by Administrator on 2019/5/25 0025.
 */
@Controller
public class DeduplicationAction {
    int counter = 0;
    private static final Logger logger = LoggerFactory.getLogger(WelcomeAction.class);
//    @RequestMapping(value = "")
//    public String  DeduplicationIndex(){
//        return "DeduplicationIndex";
//    }
    @RequestMapping("/uploader")
    public void upload(HttpServletRequest request, HttpServletResponse response){

        //String fileName;
        // File tagetFile;
        System.out.println("收到图片!");
        MultipartHttpServletRequest Murequest = (MultipartHttpServletRequest)request;
        Map<String, MultipartFile> files = Murequest.getFileMap();//得到文件map对象
        //String upaloadUrl = request.getSession().getServletContext().getRealPath("/")+"upload/";//得到当前工程路径拼接上文件名
        String t=Thread.currentThread().getContextClassLoader().getResource("").getPath();
//      //int num=t.indexOf(".metadata");
        String small = "small";
        String upaloadUrl=t.replace('/', '\\')+"image\\"+small+"\\";
        //+"项目名\\WebContent\\文件";
        File dir = new File(upaloadUrl);
        System.out.println(upaloadUrl);
        String img_url = upaloadUrl;//图片路径
        if(!dir.exists())//目录不存在则创建
            dir.mkdirs();
        for(MultipartFile file :files.values()){
            counter++;
            String fileName=file.getOriginalFilename();
            File tagetFile = new File(upaloadUrl+fileName);//创建文件对象
            img_url += fileName;
            if(!tagetFile.exists()){//文件名不存在 则新建文件，并将文件复制到新建文件中
                try {
                    tagetFile.createNewFile();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                try {
                    file.transferTo(tagetFile);
                } catch (IllegalStateException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
        }
        System.out.println(img_url);
        System.out.println("接收完毕"+counter);
    }
}
