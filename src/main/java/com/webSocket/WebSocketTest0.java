package com.webSocket;

import com.webSocket.version_01_sessionMap.HttpSessionConfigurator;
import com.webSocket.version_01_sessionMap.WebSocketServer;
import com.webSocket.version_02_Account.Account;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Created by Administrator on 2019/7/4 0004.
 */
@ServerEndpoint(value = "/WebSocket0",configurator = HttpSessionConfigurator.class)
public class WebSocketTest0 {
    private Account account;
    private HttpSession httpSession;
    public static Map<String,Session> sessionMap=new HashMap<String, Session>();
    public static Map<String,HttpSession>httpSessionMap=new HashMap<String, HttpSession>();
    //logg4j打印日志
    private static final Logger logger = LoggerFactory.getLogger(WebSocketServer.class);
    /**
     * 从httpsession中获取登陆账户，并添加到websocket中，登陆时查看httpsession中，是否已存在账户
     * */
    /**
     *
     * @param session
     * @param endpointConfig
     */
    @OnOpen
    public void start(Session session, EndpointConfig endpointConfig){
        httpSession=(HttpSession)endpointConfig.getUserProperties().get(HttpSession.class.getName());
//        account=(Account)httpSession.getAttribute("account");
        httpSessionMap.put(httpSession.getId(),httpSession);
        sessionMap.put(session.getId(),session);
    }

    /**
     * 关闭链接，移除Session
     */
    @OnClose
    public void end(){
        try {
            this.sessionInvaliddate();
        } catch (Exception e) {
        }finally{
            httpSessionMap.remove(httpSession.getId());
        }
        sessionMap.remove(httpSession.getId());
    }

    /**
     *
     * @param throwable
     * @throws Throwable
     */
    @OnError
    public  void onError(Throwable throwable)throws  Throwable{
        logger.info("异常："+throwable.getMessage());
    }
    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息*/
    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        logger.info("来自客户端的消息:" + message);
        String[]messageResolver=message.split("-");
        String sender=messageResolver[0];
        String receiver=messageResolver[1];
        String infos=messageResolver[3];
        //可以自己约定字符串内容，比如 内容|0 表示信息群发，内容|X 表示信息发给id为X的用户
        sendMessage(sender,message);

    }
    public static void sendMessage(String userId,String message){
        Session session=sessionMap.get(userId);
        try {
            session.getBasicRemote().sendText(message);
        } catch (IOException e) {
            logger.info("sendMessage异常："+e.getMessage());
        }
    }
    public static void sendToAllUsers(String message){
        Set<String> stringSet=sessionMap.keySet();
        for(String key:stringSet){
            Session session=sessionMap.get(key);
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                logger.info("sendToAllUsers异常："+e.getMessage());
            }
        }
    }
    //seesion置过期
    private  void sessionInvaliddate() throws Exception{
        new Thread(){
            @Override
            public void run(){
                try {
                    Thread.sleep(3000);
                    if(httpSessionMap.get(account.getUserId())==null){
                        httpSession.invalidate();
                    }
                } catch (Exception e) {
                }
            }
        }.start();
    }
    //判断某个账户是否在线
    public static boolean isOnline(String userId){
        if(httpSessionMap.get(userId)!=null){
            return true;
        }
        return false;
    }
}
