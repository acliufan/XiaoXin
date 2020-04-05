//
//package com.controller;
//
//import com.google.common.collect.Lists;
//import com.google.common.collect.Maps;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.ResponseBody;
//import org.springframework.web.multipart.MultipartFile;
//import org.springframework.web.multipart.MultipartHttpServletRequest;
//import org.springframework.web.multipart.commons.CommonsMultipartResolver;
//
//
//import javax.servlet.http.HttpServletRequest;
//import java.io.IOException;
//import java.util.Iterator;
//import java.util.List;
//import java.util.Map;
//
//
///**
// * Created by Administrator on 2019/5/25 0025.
// */
//
//@Controller
//public class FileController implements BindingResultMessage{
//
//    @Autowired
//    private FileShareService fileShareService;
//    private FileSaveCategory fileSaveCategory = new DateAppendSaveCategory();
//
//    @RequestMapping(value = "/upload", method = RequestMethod.POST)
//    @ResponseBody
//    public Map<String,Object> upload(HttpServletRequest req) throws IOException {
//        Map<String,Object> retMap = Maps.newHashMap();
//        retMap.put("statusCode",StatusCode.SUCCESS);
//        Map<String,Object> result = Maps.newHashMap();
//        CommonsMultipartResolver resolver = new CommonsMultipartResolver(
//                req.getSession().getServletContext());
//        if (resolver.isMultipart(req)) {
//            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) req;
//            // 取得request中的所有文件名
//            Iterator<String> iter = multiRequest.getFileNames();
//            FileShare record = null;
//            String path = null;
//            List<FileShare> list = Lists.newArrayList();
//            String prefix = "";
//            if(fileSaveCategory != null){
//                prefix = fileSaveCategory.prefixPath();
//            }
//            while (iter.hasNext()) {
//                String fileName = iter.next();
//                // 取得上传文件
//                List<MultipartFile> mfs = multiRequest.getFiles(fileName);
//                for(MultipartFile file:mfs){
//                    String originalFilename = file.getOriginalFilename();
//                    path = com.yaochfua.jframework.fileshare.core.Files.save(file,prefix);
//                    //入库
//                    record = new FileShare();
//                    record.setName(originalFilename);
//                    record.setPath(GlobalVar.fileDownloadServer+path);
//                    fileShareService.insert(record);
//                    list.add(record);
//                }
//            }
//            result.put("data",list);
//            retMap.put("result",result);
//        }
//        return retMap;
//    }
//
//
//}
//
