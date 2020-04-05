package com.webSocket.version_02_Account;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * websocket
 */
@Component
@ServerEndpoint(value = "/websocket")
public class AdminAndUsers {
    // 日志
    private static final Logger log = LoggerFactory.getLogger(AdminAndUsers.class);
    // 在线人数
    private static int onlineCount = 0;
    // 在线人员注册 一个用户可以多浏览器登录
    private static ConcurrentHashMap<String, Map<String,AdminAndUsers>> webSocketSet = new ConcurrentHashMap<>();
    // 在线管理员注册 一个用户可以多浏览器登录
    private static ConcurrentHashMap<String, Map<String,AdminAndUsers>> adminWebSocketSet = new ConcurrentHashMap<>();
    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    // 用户ID
    private String userId = "";

    /**
     * 打开连接回调方法
     * @param userId 用户ID
     * @param ip IP
     * @param isAdmin 是否管理员
     * @param session 客户端session
     */
    @OnOpen
    public void onOpen(@PathParam(value = "userId") String userId, @PathParam("ip") String ip,
                       @PathParam("isAdmin") Integer isAdmin, Session session) {

        this.session = session;
        this.userId = userId;

        if (isAdmin == 0){
            // 非管理员注册
            Map<String, AdminAndUsers> map = webSocketSet.get(userId);
            map = null == map ? new HashMap<String, AdminAndUsers>() : map;
            map.put(ip,this);
            webSocketSet.put(userId,map);

        }else {
            // 管理员注册
            Map<String,AdminAndUsers> map = adminWebSocketSet.get(userId);
            map = null == map ? new HashMap<String, AdminAndUsers>() : map;
            map.put(ip,this);
            adminWebSocketSet.put(userId,map);
        }
        //在线数加1
        addOnlineCount();
        log.info("有一个新连接！当前在线人数为" + getOnlineCount());
    }

    /**
     * 关闭连接回调方法
     * @param userId 用户ID
     * @param ip IP
     * @param isAdmin 是否管理员
     */
    @OnClose
    public void onClose(@PathParam(value = "userId") String userId,@PathParam("ip") String ip,
                        @PathParam("isAdmin") Integer isAdmin) {
        if (isAdmin == 0){
            Map<String, AdminAndUsers> map = webSocketSet.get(userId);
            if (null != map && null != map.get(ip)){
                map.remove(ip);
            }
        }else {
            Map<String, AdminAndUsers> map = adminWebSocketSet.get(userId);
            if (null != map && null != map.get(ip)){
                map.remove(ip);
            }
        }
        subOnlineCount();           //在线数减1
        log.info("有一连接关闭！当前在线人数为" + getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息*/
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("来自客户端的消息:" + message);
        //可以自己约定字符串内容，比如 内容|0 表示信息群发，内容|X 表示信息发给id为X的用户
        try {
            sendtoAll(message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 发生错误回调方法
     * @param session 连接会话
     * @param error 错误
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("发生错误");
        error.printStackTrace();
    }


    /**
     * 发送信息
     * @param message 消息
     * @throws IOException 异常
     */
    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);
    }

    /**
     * 发送信息给指定ID用户，如果用户不在线则返回不在线信息给自己
     * @param message 消息
     * @param sendUserId 用户ID
     * @throws IOException 异常
     */
    public void sendToUser(String message,String sendUserId) throws IOException {
        // 是否为非管理员
        if (webSocketSet.get(sendUserId) != null) {
            Map<String, AdminAndUsers> map = webSocketSet.get(sendUserId);
            for (AdminAndUsers wss : map.values()){
                wss.sendMessage(message);
            }
        }
        // 发送给所有管理员
        for (Map<String,AdminAndUsers> map : adminWebSocketSet.values()) {
            for (AdminAndUsers wss : map.values()){
                wss.sendMessage(message);
            }
        }
    }

    /**
     * 发送信息给所有人
     * @param message 消息
     * @throws IOException 异常
     */
    public void sendtoAll(String message) throws IOException {
        // 发送给所有非管理员用户
        for (Map<String,AdminAndUsers> map : webSocketSet.values()) {
            for (AdminAndUsers wss : map.values()){
                wss.sendMessage(message);
            }
        }
        // 发送给所有管理员用户
        for (Map<String,AdminAndUsers> map : adminWebSocketSet.values()) {
            for (AdminAndUsers wss : map.values()){
                wss.sendMessage(message);
            }
        }
    }


    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        AdminAndUsers.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        AdminAndUsers.onlineCount--;
    }

}