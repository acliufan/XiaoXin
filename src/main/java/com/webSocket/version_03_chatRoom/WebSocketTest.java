package com.webSocket.version_03_chatRoom;


import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Administrator on 2019/2/28 0028.
 */
@ServerEndpoint("/WebSocket/chat/{name}")
public class WebSocketTest {
    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static int onlineCount = 0;
    //logg4j打印日志
    private static final Logger logger = LoggerFactory.getLogger(WebSocketTest.class);
//    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。若要实现服务端与单一客户端通信的话，可以使用Map来存放，其中Key可以为用户标识
//    private static CopyOnWriteArraySet<WebSocketTest> WebSocketSet = new CopyOnWriteArraySet<WebSocketTest>();
    private static ConcurrentHashMap<String, List<WebSocketTest>> WebSocketClients = new ConcurrentHashMap<>();
    //用来保留所有当前的会话
    public static ConcurrentHashMap<String,HttpSession>httpSessionMap=new ConcurrentHashMap<>();
    // 与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    public HttpSession httpSession;
    private String name;
    private String UUID;
   /**
     * 连接建立成功调用的方法
     * @param session  可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    @OnOpen
    public void onOpen(Session session,@PathParam(value="name") String name){
        String trueName=name;
        try {
             trueName= URLDecoder.decode(name, "utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        this.session = session;
        this.name = trueName;
        List<WebSocketTest> clientList = WebSocketClients.get(name);
        if(clientList==null){
            clientList = new ArrayList<>();
        }
        UUID = WebSocketTest.getUUID();
        clientList.add(this);
        WebSocketClients.put(trueName,clientList);
        addOnlineCount();           //在线数加1
        logger.info("有新连接加入！当前在线人数为" + getOnlineCount());
        logger.info("加入用户为：【"+trueName+"】");
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(){
        //找到当前用户
        List<WebSocketTest> clientList = WebSocketClients.get(this.name);
        for(WebSocketTest chatSocket : clientList){
            if(chatSocket.UUID.equals(UUID)){
                clientList.remove(chatSocket);
                break;
            }
        }
        subOnlineCount();           //在线数减1
        logger.info("有一连接关闭！当前在线人数为" + getOnlineCount());
        //session置过期
        try {
            this.sessionInvaliddate();
        } catch (Exception e) {
        }finally{
            WebSocketClients.remove(this.name);
        }
    }

    /**
     * 收到客户端消息后调用的方法
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message) {
        logger.info("来自客户端的消息:" + message);
        //拿到客户端发送的数据包，解析其中的消息
        //如果不是心跳的数据包，则需要解析
        if(message.indexOf("heartBeat")==-1){
            RequestMsgBean msg=new RequestMsgBean();
            try {
                msg = JSONObject.parseObject(message, RequestMsgBean.class);
            }catch (Exception e){
                e.printStackTrace();
            }
            if(msg == null || StringUtils.isEmpty(msg.getName()) || StringUtils.isEmpty(msg.getSubject()) || StringUtils.isEmpty(msg.getMsg())){
                return;
            }
            //拿到接收方的WebSocketTest实例
            List<WebSocketTest> clientList = null;
                String sourceSubject= msg.getSubject();
                clientList = WebSocketClients.get(sourceSubject);
            // 如果对方在线，则发送，不在线，先不处理
            if(clientList==null || clientList.size()<1){
                RequestMsgBean msgBean = new RequestMsgBean();
                msgBean.setMsg("对方不在线，发送失败。");
                msgBean.setSubject(msg.getName());
                msgBean.setName("系统提示");
                try {
                    this.sendMessage(JSONObject.toJSONString(msgBean));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }else {
                //获取在线设备，发送
                for (WebSocketTest item : clientList) {
                    try {
                        item.sendMessage(message);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }else {
            //如果是心跳包数据直接返回心跳
            try {
                this.sendMessage(message + "响应");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 发生错误时调用
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error){
        logger.error("发生错误");
        error.printStackTrace();
    }

    /**
     * 这个方法与上面几个方法不一样。没有用注解，是根据自己需要添加的方法。
     * @param message
     * @throws IOException
     */
    public synchronized void sendMessage(String message) throws IOException{
        this.session.getBasicRemote().sendText(message);
        //this.session.getAsyncRemote().sendText(message);
    }
    //seesion置过期
    private  void sessionInvaliddate() throws Exception{
        new Thread(){
            @Override
            public void run(){
                try {
                    Thread.sleep(3000);
                    if(WebSocketClients.get(this.getName())==null){
                        httpSession.invalidate();
                    }
                } catch (Exception e) {
                }
            }
        }.start();
    }
    /**
     * Synchronized 关键字，代表这个方法加锁,
     相当于不管哪一个线程(例如线程A)，
     运行到这个方法时,都要检查有没有其它线程B(或者C、 D等)
     正在用这个方法(或者该类的其他同步方法)，
     有的话要等正在使用synchronized方法的线程B(或者C 、D)运行完这个方法后再运行此线程A,
     没有的话,锁定调用者,然后直接运行
     * @return
     */
    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocketTest.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebSocketTest.onlineCount--;
    }
    public static String getUUID(){
        String id= java.util.UUID.randomUUID().toString();
        char x= (char) (new Random().nextInt(26)+'a');
        return x+id.replace("-","");
    }
}
