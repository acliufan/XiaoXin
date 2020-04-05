package com.UploadUtil;

import com.alibaba.fastjson.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by Administrator on 2019/5/25 0025.
 */
public final class FileUploadUtil {

    public static JSONObject upload(String httpurl, String fileName, InputStream inputStream) {
        String result = "";
        try {

            String BOUNDARY = "---------7d4a6d158c9"; // 定义数据分隔线
            URL url = new URL(httpurl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setUseCaches(false);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("user-agent",
                    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
            conn.setRequestProperty("Charsert", "UTF-8");
            conn.setRequestProperty("Content-Type",
                    "multipart/form-data; boundary=" + BOUNDARY);
            OutputStream out = new DataOutputStream(conn.getOutputStream());
            byte[] end_data = ("\r\n--" + BOUNDARY + "--\r\n").getBytes();// 定义最后数据分隔线
            StringBuilder sb = new StringBuilder();
            sb.append("--");
            sb.append(BOUNDARY);
            sb.append("\r\n");
            sb.append("Content-Disposition: form-data;name=\"file" + 1
                    + "\";filename=\"" + fileName + "\"\r\n");
            sb.append("Content-Type:application/octet-stream\r\n\r\n");
            byte[] data = sb.toString().getBytes();
            out.write(data);
            DataInputStream in = new DataInputStream(inputStream);
            int bytes = 0;
            byte[] bufferOut = new byte[1024];
            while ((bytes = in.read(bufferOut)) != -1) {
                out.write(bufferOut, 0, bytes);
            }
            out.write("\r\n".getBytes()); // 多个文件时，二个文件之间加入这个
            in.close();
            out.write(end_data);
            out.flush();
            out.close();
            // 定义BufferedReader输入流来读取URL的响应
            BufferedReader reader = new BufferedReader(new InputStreamReader(
                    conn.getInputStream()));
            String line = null;
            while ((line = reader.readLine()) != null) {
                result+=line;
            }
        } catch (Exception e) {
            System.out.println("发送POST请求出现异常！" + e);
        }
        return  JSONObject.parseObject(result);
    }

    public static void main(String[] args) throws Exception {
        String content ="hellow 中国";
        InputStream ips = new ByteArrayInputStream(content.getBytes("UTF-8"));
        System.out.println(upload("http://192.168.9.21:8082/fileShare/upload","text.txt",ips));

    }
}

