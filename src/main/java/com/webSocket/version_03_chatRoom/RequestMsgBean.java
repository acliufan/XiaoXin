package com.webSocket.version_03_chatRoom;

/**
 * Created by Administrator on 2019/7/4 0004.
 */
public class RequestMsgBean {
    //信息
    private String msg;
    //发送者
    private String name;
    //待接收者
    private String subject;

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
}
